import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignupRole from './pages/SignupRole';
import SignupDetails from './pages/Signupdetails';
import SignupProfile from './pages/Signupprofile';
import Login from './pages/Login';

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/role" element={<SignupRole />} />
        <Route path="/signup/details" element={<SignupDetails />} />
        <Route path="/signup/profile" element={<SignupProfile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;