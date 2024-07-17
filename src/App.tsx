import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage/LandingPage";
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom";
import GamePage from "./pages/GameRoom/GamePage";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "./index.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      {/* <Router basename="/DrawnTogether"> */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/waitingroom"
            element={
              <ProtectedRoute>
                <WaitingRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/:roomName"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
