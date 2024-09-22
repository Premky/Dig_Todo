import React, { useState, useEffect } from 'react';
import NepaliDate from 'nepali-datetime';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import np_logo from '/Images/np_police_logo.png';

const Header = () => {
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [BASE_URL, setBase_Url] = useState();
  const getBaseURLFunc = async () => {
    const url = await getBaseUrl();
    setBase_Url(url)
  }

  useEffect(() => {
    getBaseURLFunc();
  }, []);

  const [nepaliTime, setNepaliTime] = useState();

  // Function to update Nepali time
  const updateNepaliTime = () => {
    const npTimeNow = new NepaliDate();
    setNepaliTime(npTimeNow.format('HH:mm:ss'));
  };

  // useEffect hook to update time every second
  useEffect(() => {
    const interval = setInterval(updateNepaliTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // English (Gregorian) Date
  const today = new Date();
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(undefined, options);

  // Nepali Date
  const npToday = new NepaliDate();
  const formattedDateNp = npToday.format('YYYY-MM-DD');
  const day = npToday.getDay();
  const weekDays = ['आइतवार', 'सोमवार', 'मङ्‍गलवार', 'बुधवार', 'बिहिवार', 'शुक्रवार', 'शनिवार'];
  const dayName = weekDays[day];


  const navigate = useNavigate();
  axios.defaults.withCredentials = true;


  const [user, setUser] = useState(localStorage.getItem("user"))
  const [office, setOffice] = useState('')

  const fetch_user_office=()=>{
    axios.get(`${BASE_URL}/auth/fetch_user_office/` + user)
      .then(result => {
        if (result.data.Status) {
          setOffice(result.data.Result[0])

        } else {
          console.log(result.data.Result)
        }
      }).catch(err => console.log(err))
  }

  useEffect(() => {
    if(BASE_URL){
      fetch_user_office();
    }
  }, [])

  const handleLogout = () => {
    axios.get(`${BASE_URL}/auth/logout`)
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error("Logout error:", error);
      });
  };

  return (
    <>
      <div className="row align-items-start header bg-info pt-2 m-0">
        <div className='col-2 m-0 p-0'>
          <img src={np_logo} alt="Nepal Police Logo" height={60} width={70} className='ml-3 p-1' />
        </div>
        <div className='col text-white m-0 p-0'>
          <center>
            <p className='m-0 p-0 head2' >{office.name}  </p>
            <p className='m-0 p-0 head3' >{office.address}</p>
          </center>
        </div>
        <div className='col-4 m-0 p-0'>
          <h3 className='head2'>
            {formattedDateNp}, {dayName} <br />
            {nepaliTime} &nbsp;
          </h3>
        </div>

        <div className="col-1 m-0 p-0" onClick={handleLogout}>
          <Link to="/login" className='nav-link px-0 align-center'>
            <i className='fs-2 bi-power ms-2 text-danger'></i>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
