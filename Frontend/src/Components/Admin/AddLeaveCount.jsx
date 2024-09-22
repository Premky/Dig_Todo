import React, { useEffect, useState } from 'react'
import Header from '../Headers/Header'
import Footer from '../Headers/Footer'
import { useNavigate } from 'react-router-dom'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs'
import "nepali-datepicker-reactjs/dist/index.css"
import NepaliDate from 'nepali-datetime'
import { format } from 'date-fns';
import LeaveCount from '../LeaveCount';
import axios from 'axios';
import OfficeWiseLeaveCount from '../LeaveCount/OfficeWiseLeaveCount'
import { getBaseUrl } from "../../Utilities/getBaseUrl";


const AddLeaveCount = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url]= useState();
    const getBaseURLFunc = async () =>{
        const url = await getBaseUrl();       
        setBase_Url(url) 
    }
    // console.log(BASE_URL)
    
    useEffect(()=>{
        getBaseURLFunc();
    },[BASE_URL]);
    
  const npToday = new NepaliDate();
  const formattedDateNp = npToday.format('YYYY-MM-DD');
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState();
  const [leaveCount, setLeaveCount] = useState({
    igp: '', aigp: '', digp: '', ssp: '', sp: '', dsp: '',
    insp: '', ssi: '', si: '', asi: '', shc: '', hc: '',
    ahc: '', pc: '', poa: '', date: formattedDateNp,
    user_id: localStorage.getItem("uid"), office_id: localStorage.getItem("oid"),
    branch_id: localStorage.getItem("bid")
  });

  const handleDateChange = (value) => {
    setLeaveCount({ ...leaveCount, date: value })
  }

  const handleSubmit = (e) => {
    console.log(leaveCount)
    e.preventDefault()
    if (!leaveCount.date) {
      setValidationError('Date is Required');
      return;
    }
    setValidationError('');
    console.log('submitting form data:', leaveCount);

    axios
      .post(`${BASE_URL}/auth/add_leave_count`, leaveCount)
      .then(result => { navigate('/admin/addleavecount') })
      .catch(err => console.log(err))
  }

  const handleClear = () => {
    setLeaveCount({
      igp: '', aigp: '', digp: '', ssp: '', sp: '', dsp: '',
      insp: '', ssi: '', si: '', asi: '', shc: '',
      hc: '', ahc: '', pc: '', poa: '', date: '',
      user_id: localStorage.getItem("uid"), office_id: localStorage.getItem("oid"),
      branch_id: localStorage.getItem("bid")
    });
  }

  return (
    <>
      <Header />
      <div className='container-fluid'>
        <div className="row flex-nowrap">
          <div className="col-6 m-0">
            <div className="p-2 d-flex justify-content-center shadow">
              <h3>आजको विदा अपडेट गर्नुहोस्</h3>
            </div>
            <div className="d-flex flex-column px-0 pt-0 ">
              <form className="row g-10 m-2" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <label htmlFor="inputDate">मिति:</label>
                    <NepaliDatePicker
                      inputClassName='form-control rounded-0'
                      value={leaveCount.date}
                      required
                      onChange={handleDateChange}
                      options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                    />
                    {validationError && <div className='text-danger'> {validationError}</div>}
                  </div>

                  <div className="col-4">
                    <label htmlFor="inputIgp">IGP</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputIgp' value={leaveCount.igp}
                      onChange={(e) => setLeaveCount({ ...leaveCount, igp: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="inputAigp">AIGP</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputAigp' value={leaveCount.aigp}
                      onChange={(e) => setLeaveCount({ ...leaveCount, aigp: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="inputDigp">DIGP</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputDigp' value={leaveCount.digp}
                      onChange={(e) => setLeaveCount({ ...leaveCount, digp: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="inputSsp">SSP</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputSsp' value={leaveCount.ssp}
                      onChange={(e) => setLeaveCount({ ...leaveCount, ssp: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="inputSsp">SP</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputSp' value={leaveCount.sp}
                      onChange={(e) => setLeaveCount({ ...leaveCount, sp: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="inputDsp">DSP</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputDsp' value={leaveCount.dsp}
                      onChange={(e) => setLeaveCount({ ...leaveCount, dsp: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="inputInsp">Inspector</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputInsp' value={leaveCount.insp}
                      onChange={(e) => setLeaveCount({ ...leaveCount, insp: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="inputSsi">SSI</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputSsi' value={leaveCount.ssi}
                      onChange={(e) => setLeaveCount({ ...leaveCount, ssi: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="inputSi">SI</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputsi' value={leaveCount.si}
                      onChange={(e) => setLeaveCount({ ...leaveCount, si: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="inputAsi">ASI</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputAsi' value={leaveCount.asi}
                      onChange={(e) => setLeaveCount({ ...leaveCount, asi: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="inputShc">SHC</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputShc' value={leaveCount.shc}
                      onChange={(e) => setLeaveCount({ ...leaveCount, shc: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="inputHc">HC</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputHc' value={leaveCount.hc}
                      onChange={(e) => setLeaveCount({ ...leaveCount, hc: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="inputAhc">AHC</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputAhc' value={leaveCount.ahc}
                      onChange={(e) => setLeaveCount({ ...leaveCount, ahc: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="inputPc">PC</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputPc' value={leaveCount.pc}
                      onChange={(e) => setLeaveCount({ ...leaveCount, pc: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="inputPoa">POA</label>
                    <input type="text" className='form-control rounded-0'
                      id='inputPoa' value={leaveCount.poa}
                      onChange={(e) => setLeaveCount({ ...leaveCount, poa: e.target.value })} />
                  </div>
                  <div className="col-3">
                    <button className=' px-5 mt-4 mx-4 btn btn-primary btn btn-primary'>Add</button>
                  </div>
                  <div className='col-3' >
                    <div className="px-5 mx-4 mt-4 btn btn-secondary" onClick={handleClear}>Clear</div>
                  </div>
                </div>
              </form>

            </div>
          </div>
          <div className="col-6">
            <LeaveCount />
          </div>
        </div>
        <div className="row">
          <div>
            <h5 className='bg-primary text-white text-center p-1'>कार्यालय गत विवरण </h5>
            <OfficeWiseLeaveCount />
          </div>
        </div>
        {/* <Footer /> */}
      </div >
    </>
  )
}

export default AddLeaveCount