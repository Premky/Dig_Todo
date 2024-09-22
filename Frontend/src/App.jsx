import { useState } from 'react'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import NepaliDate from 'nepali-datetime'

import Login from './Components/Login/Login'
import Header from './Components/Headers/Header'
import DigDashboard from './Components/Dashboard/DigDashboard'
import Logout from './Components/Login/Logout'
import SancharProgram from './Components/SancharProgram'
import SancharNews from './Components/SancharNews'
import DoDisplay from './Components/Dashboard/DoDisplay'
import Doo from './Components/Do/Doo'
import AddLeaveCount from './Components/Admin/AddLeaveCount'
import AddDoNotice from './Components/Do/AddDoNotice'
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'

import AddUsers from './Components/SuperUser/AddUsers'
import AddOffice from './Components/SuperUser/AddOffice'
import SuperDashboard from './Components/SuperUser/SuperDashboard'
import AddBranch from './Components/SuperUser/AddBranch'
import Header_Footer from './Components/Headers/Header_Footer'
import SancharRoute from './Components/PrivateRoute/SancharRoute'
import OfficerLeave from './Components/LeaveCount/OfficerLeave'
import CurrentOfficerLeave from './Components/LeaveCount/CurrentOfficerLeave'
import AddEmployee from './Components/Employee/AddEmployee'

function App() {
  const [count, setCount] = useState(0)
  const [officeName, setOfficeName] = useState('');
  const handleLogin = (data) => {
    setOfficeName(data.office); // Assuming `data.office` contains the office name
  };
  return (
    <>

      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {/* <Route path="/super/login" element={<SuperLogin onLogin={handleLogin} />} /> */}
          {/* Pass officeName to Header component */}
          {/* <Route path="/*" element={<Header officeName={officeName} />} /> */}


          <Route path='/news' element={
            <SancharRoute>
              <SancharNews />
            </SancharRoute>
          } />
          <Route path='/sanchar' element={
            <SancharRoute>
              <SancharProgram />
            </SancharRoute>
          } />
          <Route path='/notice' element={
            <PrivateRoute>
              <AddDoNotice />
            </PrivateRoute>
          } />

          <Route path='/doadmin' element={
            <PrivateRoute>
              <Doo />
            </PrivateRoute>
          } />


          <Route path='/admin/addleavecount' element={
            <PrivateRoute>
              <AddLeaveCount />
            </PrivateRoute>
          }>
          </Route>
          <Route path='/admin/officeleave' element={<OfficerLeave />}>
          </Route>

          <Route path='/display' element={<Header_Footer />}>
            <Route path='/display/dodisplay' element={
              // <PrivateRoute>
              <DoDisplay />
              // </PrivateRoute>
            } />

            <Route path="/display/chief" element={
              <PrivateRoute>
                <DigDashboard />
              </PrivateRoute>
            } />
          </Route>

          <Route path='/super/admin_dashboard' element={<SuperDashboard />}>
            <Route path='/super/admin_dashboard/add_user' element={
              <AddUsers />}>
            </Route>

            <Route path='/super/admin_dashboard/add_office' element={
              <AddOffice />}>
            </Route>

            <Route path='/super/admin_dashboard/add_branches' element={<AddBranch />}></Route>
            <Route path='/super/admin_dashboard/officer_leave' element={<AddEmployee />}>
            </Route>
          </Route>

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
