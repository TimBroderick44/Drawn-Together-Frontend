import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001");

export const socketEvents = {
  emitLogin: (username: string) => socket.emit("login", username),
  emitInvite: (invitee: string) => socket.emit("invite", invitee),
  emitCancelInvite: (invitee: string) => socket.emit("cancel-invite", invitee),
  emitAcceptInvite: (inviterSocketId: string) => socket.emit("accept-invite", inviterSocketId),
  emitRejectInvite: (inviterSocketId: string, inviteeName: string) => socket.emit("reject-invite", { inviterSocketId, inviteeName }),
  emitJoinRoom: (roomName: string) => socket.emit("join-room", roomName),
  emitDrawLine: (data: any) => socket.emit("draw-line", data),
  emitClear: (roomName: string) => socket.emit("clear", roomName),
  emitLeaveRoom: (roomName: string) => socket.emit("leave-room", roomName),
  onEvent: (event: string, handler: (...args: any[]) => void) => socket.on(event, handler),
  offEvent: (event: string, handler: (...args: any[]) => void) => socket.off(event, handler),
  disconnect: () => socket.disconnect(),
  connect: () => socket.connect(),
};

export default socket;
