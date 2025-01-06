import { useEffect, useState } from 'react';
import React from 'react';
import './LoginStyle.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const branch = localStorage.getItem("branch");
    const navigateBasedOnUsertype = (branch) => {
        switch (branch) {
            case 'सुपरएडमिन': return '/super/admin_dashboard';
            case 'संचार': return '/sanchar';
            case 'सचिबालय': return '/sanchar';
            case 'प्रशासन': return '/admin/addleavecount';
            case 'कार्यालय प्रमुख': return '/display/chief';
            case 'सुचना पाटी': return '/display/dodisplay';
            case 'डि.अ. प्रशासन': return '/doadmin';
            case 'कर्मचारी प्रशासन': return '/emp';
            case 'ट्राफिक': return '/tango';
            default: return '/';
        }
    };

    if (branch) {
        const path = navigateBasedOnUsertype(branch);
        navigate(path);
    }

    const [values, setValues] = useState({
        username: '',
        password: '',
        usertype: '',
    });
    const [error, setError] = useState('');

    axios.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (BASE_URL) {
            try {
                const result = await axios.post(`${BASE_URL}/auth/login`, values,{
                    withCredentials:true,
                });
                if (result.data.loginStatus) {
                    onLogin(result.data);
                    localStorage.setItem("token", result.data.token);
                    localStorage.setItem("valid", true);
                    localStorage.setItem("type", result.data.usertype);
                    localStorage.setItem("user", result.data.username);
                    localStorage.setItem("uid", result.data.uid);
                    localStorage.setItem("oid", result.data.office_id);
                    localStorage.setItem("branch", result.data.branch);
                    localStorage.setItem("bid", result.data.branch_id);
                    const path = navigateBasedOnUsertype(result.data.branch);
                    navigate(path);
                } else {
                    setError(result.data.Error || "Invalid login credentials.");
                }
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.Error || "Error logging in.");
                } else if (err.request) {
                    console.error("No response from server:", err.request);
                    setError("No response from server. Please try again later.");
                } else {
                    console.error("Request setup error:", err.message);
                    setError("An error occurred. Please try again.");
                }
            }
        } else {
            console.error("No Base URL Found");
            setError("Server configuration error. Please contact support.");
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-40 border loginForm'>
                <h2><center>Login Page</center></h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username:</strong></label>
                        <input
                            type="text"
                            name="username"
                            autoComplete="off"
                            placeholder="Enter username"
                            className="form-control"
                            onChange={(e) => setValues({ ...values, username: e.target.value })}
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input
                            type="password"
                            name="password"
                            autoComplete="off"
                            placeholder="Enter Password"
                            className="form-control"
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                        />
                        {error && <div className="text-danger">{error}</div>}
                    </div>
                    <button className='btn btn-success w-100 rounded-0'>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
