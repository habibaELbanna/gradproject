import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignupRole from './pages/SignupRole';

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/role" element={<SignupRole />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;