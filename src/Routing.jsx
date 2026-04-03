import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignupRole from './pages/SignupRole';
import SignupDetails from './pages/Signupdetails';
import SignupProfile from './pages/Signupprofile';
import Login from './pages/Login';
import VendorAnalytics from './pages/Vendoranalytics';
import BuyerAnalytics from './pages/Buyeranalytics';
import BuyerDashboard from './pages/Buyerdashboard';

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/role" element={<SignupRole />} />
        <Route path="/signup/details" element={<SignupDetails />} />
        <Route path="/signup/profile" element={<SignupProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analytics" element={<VendorAnalytics />} />
        <Route path="/vendor/dashboard" element={<VendorAnalytics />} />
        <Route path="/buyer/analytics" element={<BuyerAnalytics />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;