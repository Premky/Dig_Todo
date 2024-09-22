import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs'
import "nepali-datepicker-reactjs/dist/index.css"
import NepaliDate from 'nepali-datetime'
import { format } from 'date-fns';
import LeaveCount from '../LeaveCount';
import axios from 'axios';
import {getBaseUrl} from '../../Utilities/getBaseUrl'

const OfficeWiseLeaveCount = () => {
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [BASE_URL, setBase_Url] = useState();
  const getBaseURLFunc = async () => {
    const url = await getBaseUrl();
    setBase_Url(url)
  }

  useEffect(() => {
    getBaseURLFunc();
  }, [BASE_URL]);

  const npToday = new NepaliDate();
  const formattedDateNp = npToday.format('YYYY-MM-DD');
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState();
  const [leaveCount, setLeaveCount] = useState({
    igp: '', aigp: '', digp: '', ssp: '', sp: '', dsp: '',
    insp: '', ssi: '', si: '', asi: '', shc: '', hc: '',
    ahc: '', pc: '', poa: '', date: formattedDateNp,
    user_id: localStorage.getItem("uid"), office_id: localStorage.getItem("oid")
  });
  const [date, setDate] = useState(formattedDateNp)
  const [officeTotals, setOfficeTotals] = useState(0)
  const [rankTotals, setRankTotals] = useState(0)


  const handleDateChange = (value) => {
    setLeaveCount({ ...leaveCount, date: value })
    setValidationError('');
  }
  const handleSearchDateChange = (value) => {
    setDate(value)
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
      .then(result => { navigate('/addleavecount') })
      .catch(err => console.log(err))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    axios.post(`${BASE_URL}/auth/leave_count_office` + date)
      .then(result => {
        if (result.data.Status) {
          // setAllLeave(result.data.Result)
          const data = result.data.Result;
          aggregateData(data);
        } else {
          alert(result.data.Result)
          console.log(result.data.Result)
        }
      })

    // console.log("search", date)
  }
  const handleClear = () => {
    setLeaveCount({
      igp: '', aigp: '', digp: '', ssp: '', sp: '', dsp: '',
      insp: '', ssi: '', si: '', asi: '', shc: '',
      hc: '', ahc: '', pc: '', poa: '', date: '',
      user_id: localStorage.getItem("uid"), office_id: localStorage.getItem("oid")

    });
  }

  const [allLeave, setAllLeave] = useState()
  useEffect(() => {
    if(BASE_URL){
    axios.get(`${BASE_URL}/auth/leave_count_office`)
      .then(result => {
        if (result.data.Status) {
          // setAllLeave(result.data.Result)
          const data = result.data.Result;
          aggregateData(data);
        } else {
          alert(result.data.Result)
          console.log(result.data.Result)
        }
      }).catch(err => console.log(err))
    }
  }, [BASE_URL])

  const aggregateData = (data) => {
    const aggregateData = {};
    const rankTotals = {
      igp: 0, aig: 0, dig: 0, ssp: 0, sp: 0, dsp: 0, insp: 0, ssi: 0, si: 0, asi: 0,
      shc: 0, hc: 0, ahc: 0, pc: 0, poa: 0
    };
    data.forEach(office => {
      if (!aggregateData[office.office_name]) {
        aggregateData[office.office_name] = { ...office, total: 0 }
      } else {
        Object.keys(rankTotals).forEach(rank => {
          aggregateData[office.office_name][rank] += office[rank];
        });
      }
    });

    Object.values(aggregateData).forEach(office => {
      Object.keys(rankTotals).forEach(rank => {
        rankTotals[rank] += office[rank];
        office.total += office[rank];
      });
    });
    setAllLeave(Object.values(aggregateData));
    setOfficeTotals(rankTotals);
    setRankTotals(rankTotals);
  }

  // if (!allLeave) {
  //   return (<div>Loading...</div>)
  // }
  return (
    <>
      <div className="div">
        <div className='row'>
          <form >
            <div className="row">
              <div className="col-3">
                <label htmlFor="inputDate">मिति:</label>
                <NepaliDatePicker
                  inputClassName='form-control rounded-0'
                  value={date}
                  required
                  onChange={handleSearchDateChange}
                  options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                />
                {validationError && <div className='text-danger'> {validationError}</div>}
              </div>
              <div className="col-3 mt-4">
                <button className='btn btn-primary' onClick={handleSearch} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <td>सि.नं.</td>
              <td>मिति</td>
              <td>कार्यालय</td>
              <td>प्रनामनि</td>
              <td>प्रवउ</td>
              <td>प्रउ</td>
              <td>प्रनाउ</td>
              <td>प्रनी</td>
              <td>प्रवनानी</td>
              <td>प्रनानी</td>
              <td>प्रसनी</td>
              <td>प्रवह</td>
              <td>प्रह</td>
              <td>प्रसह</td>
              <td>प्रज</td>
              <td>प्रकास</td>
              <td>जम्मा</td>
            </tr>

          </thead>
          <tbody>
            {allLeave && allLeave.length > 0 ? (

              allLeave.map((alo, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{alo.date}</td>
                  <td>{alo.office_name}</td>
                  <td>{alo.dig}</td>
                  <td>{alo.ssp}</td>
                  <td>{alo.sp}</td>
                  <td>{alo.dsp}</td>
                  <td>{alo.insp}</td>
                  <td>{alo.ssi}</td>
                  <td>{alo.si}</td>
                  <td>{alo.asi}</td>
                  <td>{alo.shc}</td>
                  <td>{alo.hc}</td>
                  <td>{alo.ahc}</td>
                  <td>{alo.pc}</td>
                  <td>{alo.poa}</td>
                  <td>{alo.total}</td>
                </tr>
              ))

            ) : (<tr>
              <td colSpan={17}><center>No data found...</center></td>
            </tr>)
            }

          </tbody>
        </table>
      </div>
    </>
  )
}

export default OfficeWiseLeaveCount