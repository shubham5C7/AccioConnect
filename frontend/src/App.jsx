import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp"; 
import NavBar from "./Components/NavBar";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProtectedRoute from "./Components/ProtectedRoute";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />}/>
        <Route path="/" element={
          <ProtectedRoute> <Home/> </ProtectedRoute>
          }/>
        <Route path="/profile" element={
          <ProtectedRoute> <Profile /> </ProtectedRoute>
          }/>
           <Route path="/chat" element={
          <ProtectedRoute> <Chat /> </ProtectedRoute>
          }/>
        
      </Routes>
    </Router>
  );
};

export default App;
