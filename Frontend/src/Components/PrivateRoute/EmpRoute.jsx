import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const EmpRoute = () => {
    const userType = localStorage.getItem('type');
    const isValidUser = localStorage.getItem("valid") && (userType === 'कर्मचारी प्रशासन');
    return isValidUser ? <Outlet /> : <Navigate to="/" />;
};

export default EmpRoute;
