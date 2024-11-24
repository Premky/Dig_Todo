import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';

const TangoAdminDashboard = () => {
    return (
        <>
            <div className='col p-0'>
                {/* <div className='p-2 shadow bg-danger text-center'> */}
                    {/* <h4>{currentOffice.office_name || "Loading..."}</h4> */}
                    {/* <h4>{ "Loading..."}</h4> */}
                {/* </div> */}
                <Outlet /> {/* Renders nested routes */}
            </div>
        </>
    )
}

export default TangoAdminDashboard