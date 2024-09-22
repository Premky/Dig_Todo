import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import * as icon from 'react-bootstrap-icons';
import "bootstrap-icons/font/bootstrap-icons.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Headers/Header';
import Logout from '../Login/Logout';
import AddUsers from './AddUsers';

const SuperDashboard = () => {
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    return (
        <>
            <div className='container-fluid'>
                <div className='row flex-nowrap'>
                    <div className='col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-primary'>
                        <div className='d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100'>
                            <Link to="/super/admin_dashboard"
                                className='d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none '>
                                <span className='ms-2 d-none d-sm-inline fs-4'> Admin Panel </span>
                            </Link>
                            <ul className='nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items'>
                                <li className='W-100'>
                                    <Link to="/super/admin_dashboard/add_user" className='nav-link text-white px-0 align-middle'>
                                        {/* <i className='fs-4 bi-speedometer2 ms-2 '></i> */}
                                        <i class="bi bi-person-badge fs-4 "></i>
                                        <span className='ms-2 d-none d-sm-inline'>Users</span>
                                    </Link>
                                </li>
                                <li className='W-100'>
                                    <Link to="/super/admin_dashboard/add_office"
                                        className='nav-link px-0 align-middle text-white'>
                                        {/* <i className='fs-4 bi-people ms-2'></i> */}
                                        <span className='ms-2 d-none d-sm-inline'>
                                            Offices
                                        </span>
                                    </Link>
                                </li>
                                <li className='W-100'>
                                    <Link to="/super/admin_dashboard/add_branches"
                                        className='nav-link px-0 align-middle text-white'>
                                        <i class="bi bi-hdd-rack fs-4 "></i>
                                        <span className='ms-2 d-none d-sm-inline'>Branches</span>
                                    </Link>
                                </li>
                                {/* <li className='W-100'>
                                    <Link to="/dashboard/profile"
                                        className='nav-link px-0 align-middle text-white'>

                                        <span className='ms-2 d-none d-sm-inline'>Profile</span>
                                    </Link>
                                </li> */}
                                <li className='W-100' >
                                    <div to="/dashboard/logout"
                                        className='nav-link px-0 align-middle text-white'>
                                        <i className='fs-4 bi-power ms-2'></i>
                                        <span className='ms-2 d-none d-sm-inline'><Logout /></span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='col p-0 m-0'>
                        <div className='p-2 d-flex justify-content-center shadow bg-info'>
                            <h4>Koshi Province Police Office</h4>
                        </div>
                        <Outlet/>

                    </div>
                </div>
            </div>
        </>
    )
}

export default SuperDashboard