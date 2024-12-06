import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import Logout from '../Login/Logout';
const token = localStorage.getItem("toekn");
const TangoDashboard = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [currentOffice, setCurrentOffice] = useState({});

    useEffect(() => {
        const fetchCurrentOffice = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/display/currentoffice/${localStorage.getItem('oid')}`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
                if (response.data.Status) {
                    setCurrentOffice(response.data.Result[0]);
                } else {
                    console.error(response.data.Error);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCurrentOffice();
    }, [BASE_URL]);

    const usertype = localStorage.getItem('type');

    return (
        <div className='container-fluid'>
            <div className='row flex-nowrap'>
                <div className='col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-primary'>
                    <div className='d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100'>
                        <Link to="/tango/" className='d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none'>
                            <span className='fs-4 text-warning'>
                                {usertype === 'Admin' ?
                                    'Admin Panel' : 'User Panel'
                                }
                            </span>
                        </Link>
                        <ul className='nav flex-column mb-0'>
                            {usertype==='superuser' &&
                                <li><Link to="/tango/report/tango-user" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>Users</span></Link></li>
                            }
                            
                            {(usertype === 'Admin' || usertype === 'superuser') && (
                                <>
                                    <li><Link to="/tango/report/rajashwa-report" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>राजश्व Report</span></Link></li>
                                    <li><Link to="/tango/report/kasur-report" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>कसुर Report</span></Link></li>
                                    <li><Link to="/tango/report/arrest_vehicle-report" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>पक्राउ सवारी साधन Report</span></Link></li>
                                </>
                            )}

                            <li><Link to="/tango/arrestedvehicle-form" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>पक्राउ सवारी साधन</span></Link></li>
                            <li><Link to="/tango/rajashwa-form" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>दैनिक राजश्व</span></Link></li>
                            <li><Link to="/tango/kasur-form" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>दैनिक कसुर</span></Link></li>
                            <li><div className='nav-link text-white'><i className="bi bi-power fs-4"></i><Logout /></div></li>

                            {(usertype === 'Admin' || usertype === 'superuser') &&
                                <>
                                    <li><Link to="/tango/vehicle" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>सवारी साधन</span></Link></li>
                                    <li><Link to="/tango/kasur" className='nav-link text-white'><i className="bi bi-person-badge fs-4"></i><span className='text-white'>कसुर शिर्षक</span></Link></li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
                <div className='col p-0'>
                    <div className='p-2 shadow bg-info text-center'>
                        <h4>{currentOffice.office_name || "Loading..."}</h4>
                    </div>
                    <Outlet /> {/* Renders nested routes */}
                </div>
            </div>
        </div>
    );
    
};

export default TangoDashboard;
