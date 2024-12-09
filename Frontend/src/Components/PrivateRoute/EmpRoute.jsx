import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const EmpRoute = () => {
    const branch = localStorage.getItem('branch');
    const isValidUser = localStorage.getItem("valid") && (branch === 'कर्मचारी प्रशासन');
    return isValidUser ? <Outlet /> : <Navigate to="/" />;
};

export default EmpRoute;
