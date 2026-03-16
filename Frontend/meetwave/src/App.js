import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import Signin from "./pages/Signin";
// import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path ='/singin' element ={<Signin/>} />
        <Route path ='/register' element ={<Register/>} />
      </Routes>
    </Router>
  );
}

export default App;