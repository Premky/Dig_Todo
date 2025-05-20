import { useState } from 'react'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import NepaliDate from 'nepali-datetime'
import { AuthProvider, useAuth } from './Context/AuthContext'

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
import QualificationFrom from './Components/Employee/QualificationFrom'
import TrainingForm from './Components/Employee/TrainingForm'
import AwardForm from './Components/Employee/AwardForm'
import DecorationForm from './Components/Employee/DecorationForm'
import PunishmentForm from './Components/Employee/PunishmentForm'
import JobDescriptionForm from './Components/Employee/JobDescriptionForm'
import EmpChangeForm from './Components/Employee/EmpChangeForm'
import FinalPreview from './Components/Employee/FinalPreview'
import Employee from './Components/Employee/Employee'
import TangoHome from './Components/Tango/Admin/TangoHome'
import TangoDashboard from './Components/Tango/TangoDashboard'
import PunishmentActionForm from './Components/Tango/Client/DailyRajashwaForm'
import DailyKasurForm from './Components/Tango/Client/DailyKasurForm'
import VehicleForm from './Components/Tango/Admin/VehicleTypes'
import KasurForm from './Components/Tango/Admin/KasurTypes'
import EmpRoute from './Components/PrivateRoute/EmpRoute'
import TangoRoute from './Components/PrivateRoute/TangoRoute'
import TangoAdminDashboard from './Components/Tango/Admin/TangoAdminDashboard'
import KasurReport from './Components/Tango/Admin/DailyKasurReport'
import RajashwaReport from './Components/Tango/Admin/DailyRajashwaReport'
import EmpDashboard from './Components/Employee/EmpDashboard'
import ArrestedVehicleForm from './Components/Tango/Client/ArrestedVehicleForm'
import ArrestVehicleReport from './Components/Tango/Admin/ArrestVehicleReport'
import Users from './Components/Tango/SuperAdmin/Users'

function App() {
  const [count, setCount] = useState(0)
  const [officeName, setOfficeName] = useState('');
  const handleLogin = (data) => {
    setOfficeName(data.office); // Assuming `data.office` contains the office name
  };
  return (
    <>

      <AuthProvider>
        <BrowserRouter>

          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />


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

            <Route path='/emp' element={<EmpRoute />} >
              <Route element={<EmpDashboard />}>
                <Route index element={<Employee />} />
                <Route path='/emp/addemp_form/' element={<AddEmployee />} />
                <Route path='/emp/edit_emp_from/:pmis?' element={<AddEmployee />} />
                <Route path='/emp/qualification-form/:pmis?' element={<QualificationFrom />} />
                <Route path='/emp/training-form/:pmis?' element={<TrainingForm />} />
                <Route path='/emp/award-form/:pmis?' element={<AwardForm />} />
                <Route path='/emp/decoration-form/:pmis?' element={<DecorationForm />} />
                <Route path='/emp/punishment-form/:pmis?' element={<PunishmentForm />} />
                <Route path='/emp/job-description-form/:pmis?' element={<JobDescriptionForm />} />
                <Route path='/emp/job-working-form/:pmis?' element={<EmpChangeForm />} />
                <Route path='/emp/3puste/:pmis?' element={<FinalPreview />} />
              </Route>
            </Route>

            <Route path='/tango' element={<TangoRoute />}> {/* Secured Route */}
              <Route element={<TangoDashboard />}> {/* Common Layout */}
                <Route index element={<TangoHome />} /> {/* Default Route */}
                <Route path='kasur-form' element={<DailyKasurForm />} />
                <Route path='rajashwa-form' element={<PunishmentActionForm />} />
                <Route path='arrestedvehicle-form' element={<ArrestedVehicleForm />} />
                <Route path='vehicle' element={<VehicleForm />} />
                <Route path='kasur' element={<KasurForm />} />
                <Route path='report' element={<TangoAdminDashboard />}>
                  <Route path='tango-user' element={<Users />} />
                  <Route path='kasur-report' element={<KasurReport />} />
                  <Route path='rajashwa-report' element={<RajashwaReport />} />
                  <Route path='arrest_vehicle-report' element={<ArrestVehicleReport />} />
                </Route>
              </Route>
            </Route>
          </Routes>

        </BrowserRouter >
      </AuthProvider>
    </>
  )
}

export default App
