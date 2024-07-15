import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  AuthContextType,
  AuthProviderProps,
  DecodedToken,
} from "../types/typing";
import socket from "../utils/socketEvents"; 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      setUserName(decodedToken.sub);
      setIsAuthenticated(true);
      socket.connect();
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decodedToken: DecodedToken = jwtDecode(token);
    setUserName(decodedToken.sub);
    setIsAuthenticated(true);
    socket.connect();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserName(null);
    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
        loading,
        login,
        logout,
        getSocket: () => socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
