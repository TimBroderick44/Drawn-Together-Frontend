import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../../containers/modal/Modal";
import { socketEvents } from "../../utils/socketEvents";

const WaitingRoom: React.FC = () => {
  const { userName, logout } = useAuth();
  const [users, setUsers] = useState<string[]>([]);
  const [userStates, setUserStates] = useState<{ [key: string]: string }>({});
  const [invites, setInvites] = useState<
    { inviterSocketId: string; inviterName: string }[]
  >([]);
  const [sentInvites, setSentInvites] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Display modal if there is a message in the location state
  // Location state is used to pass messages from other pages
  // e.g. trying to access a room that isn't allowed. 
  useEffect(() => {
    if (location.state?.message) {
      setModalMessage(location.state.message);
      setShowModal(true);
    }
  }, [location.state]);

  // onEvent => listens for events from the server

  useEffect(() => {
    if (userName) {
      socketEvents.emitLogin(userName);

      socketEvents.onEvent("updateUserList", (userList: string[]) => {
        setUsers(userList.filter((user) => user !== userName));
      });

      socketEvents.onEvent(
        "updateUserStates",
        (updatedStates: { [key: string]: string }) => {
          setUserStates(updatedStates);
          setSentInvites((prev) =>
            prev.filter((invitee) => updatedStates[invitee] === "online")
          );
        }
      );

      socketEvents.onEvent(
        "updateInvites",
        (updatedInvites: { [key: string]: string[] }) => {
          setSentInvites(updatedInvites[userName] || []);
          setInvites((prev) =>
            prev.filter((invite) =>
              updatedInvites[invite.inviterName]?.includes(userName)
            )
          );
        }
      );

      socketEvents.onEvent(
        "invite",
        ({
          inviterSocketId,
          inviterName,
        }: {
          inviterSocketId: string;
          inviterName: string;
        }) => {
          setInvites((prev) => [...prev, { inviterSocketId, inviterName }]);
        }
      );

      
      socketEvents.onEvent("invite-accepted", (roomName: string) => {
        setInvites([]);
        setSentInvites([]);
        socketEvents.emitJoinRoom(roomName);
        navigate(`/game/${roomName}`);
      });

      socketEvents.onEvent("updateAllInvites", () => {
        setInvites([]);
        setSentInvites([]);
      });

      socketEvents.onEvent(
        "invite-rejected",
        ({ inviteeName }: { inviteeName: string }) => {
          setModalMessage(`Your invitation to ${inviteeName} was rejected!`);
          setShowModal(true);
          setSentInvites((prev) =>
            prev.filter((invitee) => invitee !== inviteeName)
          );
        }
      );

      socketEvents.onEvent(
        "invite-cancelled",
        ({ inviterName }: { inviterName: string }) => {
          setInvites((prev) =>
            prev.filter((invite) => invite.inviterName !== inviterName)
          );
          setSentInvites((prev) =>
            prev.filter((invitee) => invitee !== inviterName)
          );
        }
      );

      socketEvents.onEvent("start-drawing-session", (roomName: string) => {
        navigate(`/game/${roomName}`);
      });

      socketEvents.onEvent("partner-left", () => {
        setInvites([]);
        setSentInvites([]);
        navigate("/waitingroom", {
          state: { message: "Unfortunately, your partner bailed on you!" },
        });
      });

      // Cleanup
      return () => {
        socketEvents.offEvent("updateUserList", () => {});
        socketEvents.offEvent("updateUserStates", () => {});
        socketEvents.offEvent("updateInvites", () => {});
        socketEvents.offEvent("invite", () => {});
        socketEvents.offEvent("invite-accepted", () => {});
        socketEvents.offEvent("invite-rejected", () => {});
        socketEvents.offEvent("invite-cancelled", () => {});
        socketEvents.offEvent("start-drawing-session", () => {});
        socketEvents.offEvent("partner-left", () => {});
      };
    }
  }, [userName, navigate]);

  const handleInvite = (invitee: string) => {
    socketEvents.emitInvite(invitee);
  };

  const handleCancelInvite = (invitee: string) => {
    socketEvents.emitCancelInvite(invitee);
  };

  const handleAcceptInvite = (inviterSocketId: string) => {
    socketEvents.emitAcceptInvite(inviterSocketId);
    setInvites((prev) =>
      prev.filter((invite) => invite.inviterSocketId !== inviterSocketId)
    );
    setSentInvites([]);
  };

  const handleRejectInvite = (inviterSocketId: string) => {
    socketEvents.emitRejectInvite(inviterSocketId, userName!);
    setInvites((prev) =>
      prev.filter((invite) => invite.inviterSocketId !== inviterSocketId)
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen items-center bg-stick bg-cover w-screen">
      <h2 className="text-7xl font-bold text-center mt-5 mb-5 ml-2 font-sketch">
        Who wants to play with {userName}?
      </h2>
      <div className="flex justify-center w-11/12 h-screen">
        <div className="flex flex-col w-7/12">
          <h3 className="text-4xl font-marker text-center text-black mt-3 mb-2">
            Users Online:
          </h3>
          <ul className="flex justify-start items-center flex-wrap ml-20">
            {users.map((user) => (
              <li
                key={user}
                className={`flex justify-between items-center w-5/12 p-2 pl-5 pr-3 ${
                  sentInvites.includes(user) ? "bg-green-300" : "bg-gray-200"
                } rounded-md text-1xl m-1 text-center`}
              >
                {user}
                {userStates[user] === "online" ? (
                  <>
                    {!sentInvites.includes(user) && (
                      <button
                        onClick={() => handleInvite(user)}
                        className="bg-blue-500 text-white pl-3 pr-3 pt-1 pb-2 rounded-md hover:bg-blue-600 transform transition duration-700 hover:scale-110"
                      >
                        Invite
                      </button>
                    )}
                    {sentInvites.includes(user) && (
                      <button
                        onClick={() => handleCancelInvite(user)}
                        className="bg-red-500 text-white pl-3 pr-3 pt-1 pb-2 rounded-md hover:bg-red-600 transform transition duration-700 hover:scale-110"
                      >
                        Cancel
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500">In-Game</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col w-1/2">
          <h3 className="text-4xl font-marker text-center text-black mt-3 mb-2">
            Invites:
          </h3>
          {invites.length > 0 ? (
            <ul className="flex justify-center items-start flex-wrap">
              {invites.map(({ inviterSocketId, inviterName }) => (
                <li
                  className="flex flex-col justify-between items-center w-5/12 p-2 pl-5 pr-3 bg-gray-200 rounded-md text-1xl m-1 text-center"
                  key={inviterSocketId}
                >
                  {inviterName} <br /> invited you to play!
                  <div className="flex justify-center gap-2 m-2 items-center w-full">
                    <button
                      className="bg-blue-500 text-white pl-3 pr-3 pt-1 pb-2 rounded-md hover:bg-blue-600 transform transition duration-700 hover:scale-110"
                      onClick={() => handleAcceptInvite(inviterSocketId)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white pl-3 pr-3 pt-1 pb-2 rounded-md hover:bg-red-600 transform transition duration-700 hover:scale-110"
                      onClick={() => handleRejectInvite(inviterSocketId)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-black text-xl text-opacity-90 font-semibold italic">
              It looks like nobody wants to play with you...
            </p>
          )}
        </div>
      </div>
      <button
        className="bg-red-500 w-1/6 font-wild text-5xl p-1 pb-3 mb-10 rounded-md hover:bg-red-600 mt-5 transform transition duration-700 hover:scale-110"
        onClick={handleLogout}
      >
        Logout
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} message={modalMessage} />
      )}
    </div>
  );
};

export default WaitingRoom;
