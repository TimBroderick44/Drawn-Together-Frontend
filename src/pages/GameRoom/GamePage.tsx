import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import { useAuth } from "../../context/AuthContext";
import { useDraw } from "../../hooks/useDraw";
import { drawLine } from "../../utils/drawUtils";
import { DrawLine } from "../../types/typing";
import { socketEvents } from "../../utils/socketEvents";

const GamePage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const { isAuthenticated } = useAuth();
  const [color, setColor] = useState<string>("#000");
  const navigate = useNavigate();

  const { canvasRef, onMouseDown, clear } = useDraw(
    ({ ctx, currentPoint, prevPoint }) => {
      drawLine({ prevPoint, currentPoint, ctx, color });
      socketEvents.emitDrawLine({ prevPoint, currentPoint, color, roomName });
    }
  );

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // sets the background so that if downloaded, it won't just be the strokes.
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [canvasRef]);

  useEffect(() => {
    if (roomName && isAuthenticated) {
      const ctx = canvasRef.current?.getContext("2d");

      socketEvents.emitJoinRoom(roomName);

      // get the current state of the canvas
      // this is to ensure that the user joining the room gets the current state of the canvas
      // not important now as both users begin at the same time with a blank canvas
      // However, in future, if a user joins a room where the other user has already drawn something
      // this will be useful.

      socketEvents.onEvent("canvas-state-from-server", (state: string) => {
        const img = new Image();
        img.src = state;
        img.onload = () => {
          ctx?.drawImage(img, 0, 0);
        };
      });

      socketEvents.onEvent(
        "draw-line",
        ({ prevPoint, currentPoint, color }: DrawLine) => {
          if (!ctx) return;
          drawLine({ prevPoint, currentPoint, ctx, color });
        }
      );
      
      socketEvents.onEvent("clear", () => {
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
        }
      });

      socketEvents.onEvent("partner-left", () => {
        navigate("/waitingroom", {
          state: { message: "Unfortunately, your partner bailed on you!" },
        });
      });

      socketEvents.onEvent("partner-disconnected", () => {
        navigate("/waitingroom", {
          state: {
            message:
              "It seems your partner was disconnected.... You've been returned to the waiting room",
          },
        });
      });

      socketEvents.onEvent("unauthorized-access", () => {
        navigate("/waitingroom", {
          state: {
            message:
              "Naughty Naughty! You're trying to access somebody else's room!",
          },
        });
      });

      // Cleanup
      return () => {
        socketEvents.offEvent("canvas-state-from-server", () => {});
        socketEvents.offEvent("draw-line", () => {});
        socketEvents.offEvent("clear", () => {});
        socketEvents.offEvent("partner-left", () => {});
        socketEvents.offEvent("partner-disconnected", () => {});
      };
    } else if (!isAuthenticated) {
      navigate("/", { state: { message: "You need to log in first!" } });
    }
  }, [roomName, navigate, isAuthenticated]);

  const handleClearCanvas = () => {
    const ctx = canvasRef.current!.getContext("2d");
    if (ctx) {
      clear();
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      socketEvents.emitClear(roomName!);
    }
  };

  const handleBackToWaitingRoom = () => {
    // Need to emit a leave room event so that the other user can be notified and moved back to the waiting room too.
    socketEvents.emitLeaveRoom(roomName!);
    navigate("/waitingroom");
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "drawing.png";
      link.click();
    }
  };

  return (
    <div className="box-border w-screen h-screen bg-white flex justify-center items-center bg-stick bg-cover gap-5 overflow-hidden">
      <div className="flex flex-col justify-center items-end h-screen gap-5">
        <HexColorPicker color={color} onChange={setColor} />
        <div className="flex flex-col gap-2 w-full justify-center items-end mb-20">
          <button
            type="button"
            className="bg-red-500 text-black-100 p-2 rounded-md font-wild text-4xl w-9/12 tracking-wider hover:bg-red-600 transform transition duration-700 hover:scale-110"
            onClick={handleClearCanvas}
          >
            Clear Canvas
          </button>
          <button
            type="button"
            className="bg-green-500 text-black-100 p-3 rounded-md font-wild text-4xl w-9/12 hover:bg-green-600 transform transition duration-700 hover:scale-110"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
        <button
          type="button"
          className="bg-red-500 text-black-100 p-1 rounded-md font-wild text-4xl w-9/12 hover:bg-red-600 transform transition duration-700 hover:scale-110"
          onClick={handleBackToWaitingRoom}
        >
          Back to Waiting Room
        </button>
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={550}
        className="border border-black rounded-md -mt-30 bg-white shadow-2xl"
      />
    </div>
  );
};

export default GamePage;
