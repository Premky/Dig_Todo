import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const TangoRoute = () => {
    const userType = localStorage.getItem('branch');
    // console.log(userType)
    const isValidUser = localStorage.getItem("valid") && (userType === 'ट्राफिक');
    return isValidUser ? <Outlet /> : <Navigate to="/" />;
};

export default TangoRoute;
