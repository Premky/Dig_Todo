import { useEffect, useState } from 'react'
import React from 'react'
import './LoginStyle.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getBaseUrl } from '../../Utilities/getBaseUrl'




const Login = ({ onLogin }) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL
    // const [BASE_URL, setBase_Url] = useState();
    // const getBaseURLFunc = async () => {
    //     const url = await getBaseUrl();
    //     setBase_Url(url)
    // }
    // // console.log(BASE_URL)

    // useEffect(() => {
    //     getBaseURLFunc();
    // }, [BASE_URL]);

    const navigate = useNavigate()
    const branch = localStorage.getItem("bid");

    const navigateBasedOnUsertype = (branch) => {
        switch (branch) {
            case 'सुपरएडमिन':
                return '/super/admin_dashboard';
            case 'संचार':
                return '/sanchar';
            case 'प्रशासन':
                return '/admin/officeleave';
            case 'कार्यालय प्रमुख':
                return '/display/chief';
            case 'सुचना पाटी':
                return '/display/dodisplay';
            case 'डि.अ. प्रशासन':
                return '/doadmin';
            case 'कर्मचारी प्रशासन':
                return '/emp';
            case 'ट्राफिक':
                return '/tango';
            default:
                return '/';
        }
    };

    if(branch){
        navigateBasedOnUsertype(branch)
    }

    //Object Method
    const [values, setValues] = useState({
        username: '',
        password: '',
        usertype: '',
    })
    const [error, setError] = useState()

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(BASE_URL)
        if (BASE_URL) {
            axios.post(`${BASE_URL}/auth/login`, values)
                // const {loginStatus, usertype, token, ut} = res.data
                // .then(result=>console.log(result.data))

                .then(result => {
                    if (result.data.loginStatus) {
                        onLogin(result.data);
                        // console.log(result.data.token)                        
                        localStorage.setItem("token", result.data.token)
                        localStorage.setItem("valid", true)
                        localStorage.setItem("type", result.data.usertype)
                        localStorage.setItem("user", result.data.username)
                        localStorage.setItem("uid", result.data.uid)
                        localStorage.setItem("oid", result.data.office_id)
                        localStorage.setItem("branch", result.data.branch)
                        localStorage.setItem("bid", result.data.branch_id)
                        const path = navigateBasedOnUsertype(result.data.branch);
                        navigate(path);
                    } else {
                        setError(result.data.Error)
                    }
                })
                .catch(err => console.log(err))
        } else {
            console.log("No Base Url Found")
        }
    }

    const handleSuperClick = () => {
        navigate('/super/login')
    }
    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-40 border loginForm'>
                <h2><center>Login Page</center></h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username:</strong></label>
                        <input type="text" name='username' autoComplete='off' placeholder='Enter username'
                            className='form-control' rounded-0='true'
                            onChange={(e) => setValues({ ...values, username: e.target.value })} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input type="password" name='password' autoComplete='off' placeholder='Enter Password'
                            className='form-control' rounded-0='true'
                            onChange={(e) => setValues({ ...values, password: e.target.value })} />
                        <div className="text-danger">
                            {error && error}
                        </div>
                    </div>
                    <button className='btn btn-success w-100 rounded-0'>
                        Login
                    </button>
                </form>
                {/* <span onClick={handleSuperClick}>**</span> */}
            </div>
        </div>
    )
}

export default Login