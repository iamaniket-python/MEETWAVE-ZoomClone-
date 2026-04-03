import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing";
import History from "./pages/history"; 
import Signin from "./pages/signin";
import Register from "./pages/register";

import { AuthProvider } from "./contexts/Authcontext";
import VideoMeet from "./pages/Videomeet";
import HomeComponent from "./pages/home";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:url" element={<VideoMeet />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
