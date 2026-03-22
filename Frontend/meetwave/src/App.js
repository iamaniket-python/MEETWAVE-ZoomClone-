import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing";

import Authentication from "./pages/authentication";
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
          <Route path="/signin" element={<Authentication />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:url" element={<VideoMeet />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
