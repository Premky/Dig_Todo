import { useEffect, useState } from 'react'
import React from 'react'
import './LoginStyle.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getBaseUrl } from '../../Utilities/getBaseUrl'




const Login = ({ onLogin }) => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }
    // console.log(BASE_URL)

    useEffect(() => {
        getBaseURLFunc();
    }, []);

    const navigate = useNavigate()
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

        if (BASE_URL) {
            axios.post(`${BASE_URL}/auth/login`, values)
                // const {loginStatus, usertype, token, ut} = res.data
                // .then(result=>console.log(result.data))

                .then(result => {
                    if (result.data.loginStatus) {
                        onLogin(result.data);
                        localStorage.setItem("valid", true)
                        localStorage.setItem("type", result.data.usertype)
                        localStorage.setItem("user", result.data.username)
                        localStorage.setItem("uid", result.data.uid)
                        localStorage.setItem("oid", result.data.office_id)
                        localStorage.setItem("bid", result.data.branch_id)
                        // setOfficeName(result.data.office)                
                        // console.log("result:", result)
                        if (result.data.usertype === "superuser") {
                            navigate('/super/admin_dashboard')
                        }
                        if (result.data.usertype === "संचार") {
                            navigate('/sanchar')
                        }
                        if (result.data.usertype === "प्रशासन") {
                            navigate('/admin/officeleave')
                        }
                        if (result.data.usertype === "Display") {
                            if (result.data.branch === "कार्यालय प्रमुख") {
                                navigate('/display/chief')
                            } else {
                                navigate('/display/dodisplay')
                            }
                        }
                        if (result.data.usertype === "डि.अ. प्रशासन") {
                            navigate('/doadmin')
                        }
                    } else {
                        setError(result.data.Error)
                    }
                })
                .catch(err => console.log(err))
        }else{
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