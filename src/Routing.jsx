import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignupRole from './pages/SignupRole';
import SignupDetails from './pages/Signupdetails';
import SignupProfile from './pages/Signupprofile';
import Login from './pages/Login';
import VendorDashboard from './pages/Vendordashboard';
import VendorAnalytics from './pages/Vendoranalytics';
import VendorProfile from './pages/VendorProfile';
import BuyerDashboard from './pages/Buyerdashboard';
import BuyerAnalytics from './pages/Buyeranalytics';
import BuyerProfile from './pages/Buyerprofile';
import BrowseCategories from './pages/BrowseCategories';

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/role" element={<SignupRole />} />
        <Route path="/signup/details" element={<SignupDetails />} />
        <Route path="/signup/profile" element={<SignupProfile />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/analytics" element={<VendorAnalytics />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />
        <Route path="/vendor/profile/:id" element={<VendorProfile />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/analytics" element={<BuyerAnalytics />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />
        <Route path="/browse" element={<BrowseCategories />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;