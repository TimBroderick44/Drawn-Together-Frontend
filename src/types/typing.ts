import { ReactNode } from "react";
import { Socket } from "socket.io-client"; // Import Socket type

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
}

export interface DecodedToken {
  sub: string;
  exp: number;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  getSocket: () => Socket | null; // Adjust the return type to Socket
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface Point {
  x: number;
  y: number;
}

export interface Draw {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
}

export interface DrawLineProps {
  prevPoint: Point | null;
  currentPoint: Point;
  ctx: CanvasRenderingContext2D;
  color: string;
}

export interface DrawLine {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
}

export interface HttpRequest {
  headers: Record<string, string>;
  body: any;
}

export interface HttpResponse {
  status: number;
  body: any;
}

export interface FlexboxProps {
  flexdirection?: "column" | "row";
  justifycontent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  alignitems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  gap?: number;
  children: ReactNode;
}

export interface User {
  username: string;
  password: string;
}

export interface ModalProps {
  onClose: () => void;
  message: string;
}
