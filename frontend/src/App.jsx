import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp"; 
import NavBar from "./Components/NavBar";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile" element={<Profile />}/>
        
      </Routes>
    </Router>
  );
};

export default App;
