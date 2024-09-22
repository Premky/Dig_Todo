import React, { useEffect, useState } from 'react'
import Header from '../Headers/Header'
import Footer from '../Headers/Footer'
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"
import { Link, useNavigate } from 'react-router-dom'
import DoDuties from '../Do/DoDuties'
import axios from 'axios'
import NepaliDate from 'nepali-datetime'
import {getBaseUrl} from '../../Utilities/getBaseUrl'

const Doo = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }

    useEffect(() => {
        getBaseURLFunc();
    }, []);

    const navigate = useNavigate()
    const [sdatevalidationError, setsDateValidationError] = useState();
    const [edatevalidationError, seteDateValidationError] = useState();
    // const [SelectedValue, setSelectedValue] = useState();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');

    const [duty, setDuty] = useState({
        start_date: formattedDateNp,
        start_time: '',
        end_date: formattedDateNp,
        end_time: '',
        name: '',
        contact: '',
        dutytype: '',
        remarks: '',
        user_id: localStorage.getItem("uid"),
        branch_id: localStorage.getItem("bid"),
        office_id: localStorage.getItem("oid"),
    });

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!duty.start_date) {
            setsDateValidationError('Start Date is required');
            return;
        }
        if (!duty.end_date) {
            seteDateValidationError('End Date is required');
            return;
        }

        console.log(duty)
        axios
            .post(`${BASE_URL}/auth/add_doduty`, duty)
            .then(result => { navigate('/doadmin') })
            .catch(err => console.log(err))
    }
    const handleStartDateChange = (value) => {
        setDuty({ ...duty, start_date: value });
        setsDateValidationError('');
    };
    const handleEndDateChange = (value) => {
        setDuty({ ...duty, end_date: value });
        seteDateValidationError('');
    };
    const handleDutyTypeChange = (e) => {
        setDuty({ ...duty, dutytype: e.target.value })
        // console.log(duty.dutytype)
    }
    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    {/* <div className="col p-0 m-0"> */}
                    <div className="col-auto col-md-6 col-xl-6 px-sm-6 px-o ">
                        <div className="p-2 d-flex justify-content-center shadow">
                            <div className="col-10">
                                <h3>यो सप्ताहको ड्युटी अपडेट गर्नुहोस्</h3>
                            </div>
                            <div className="col-2">
                                <Link to='/notice'>
                                    <button className='btn btn-sm btn-success'>सुचनाहरु</button>
                                </Link>
                            </div>
                        </div>
                        <div className="d-flex flex-column px-0 pt-0 min-vh-100">
                            <form className='row g-10 m-2' onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-6">
                                        <label htmlFor="inputDate" className='form-label'>
                                            सुरु मिति:
                                        </label>
                                        <NepaliDatePicker
                                            inputClassName="form-control rounded-0"
                                            value={duty.start_date}
                                            required
                                            onChange={handleStartDateChange}
                                            options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                        />
                                        {sdatevalidationError && <div className='text-danger'>{sdatevalidationError}</div>}
                                    </div>

                                    <div className="col-6">
                                        <label htmlFor="inputDate" className='form-label'>
                                            सुरु समय:
                                        </label>
                                        <input type="time" className='form-control rounded-0'
                                            id='inputDate'
                                            onChange={(e) => setDuty({ ...duty, start_time: e.target.value })} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <label htmlFor="inputDate" className='form-label'>
                                            समाप्त मिति:
                                        </label>
                                        <NepaliDatePicker
                                            inputClassName="form-control rounded-0"
                                            value={duty.end_date}
                                            required
                                            onChange={handleEndDateChange}
                                            options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                        />
                                        {edatevalidationError && <div className='text-danger'>{edatevalidationError}</div>}
                                    </div>

                                    <div className="col-6">
                                        <label htmlFor="inputDate" className='form-label'>
                                            समाप्त समय:
                                        </label>
                                        <input type="time" className='form-control rounded-0'
                                            id='inputDate'
                                            onChange={(e) => setDuty({ ...duty, end_time: e.target.value })} />
                                    </div>
                                </div>

                                <div className="col-11">
                                    <label htmlFor="inputName" className='form-label'>
                                        नामथर:
                                    </label>
                                    <input type="text" className='form-control rounded-0'
                                        id='inputName'
                                        onChange={(e) => setDuty({ ...duty, name: e.target.value })} />
                                </div>

                                <div className="col-11">
                                    <label htmlFor="inputContact" className='form-label'>
                                        सम्पर्क नं.:
                                    </label>
                                    <input type='text' className='form-control rounded-0'
                                        id='inputName'
                                        onChange={(e) => setDuty({ ...duty, contact: e.target.value })} />
                                </div>

                                <div className="col-11">
                                    <label htmlFor="inputDutyType" className='form-label'>
                                        फि.अ. / डि.अ. / डि.अ. सहायक:
                                    </label>
                                    <select name="DutyType" id="inputDutyType" className='form-control rounded-0'
                                        onChange={handleDutyTypeChange} value={duty.dutytype}
                                    >
                                        <option value="" disabled>कृपया चयन गर्नुहोस्</option>
                                        <option value="1">फि.अ.</option>
                                        <option value="2">डि.अ.</option>
                                        <option value="3">डि.अ. सहायक</option>
                                        <option value="4">अन्य</option>
                                    </select>

                                    {/* <input type='Number' className='form-control rounded-0'
                                        id='inputName'
                                        onChange={(e) => setDuty({ ...duty, dutytype: e.target.value })} /> */}
                                </div>

                                <div className="col-11">
                                    <label htmlFor="inputDate" className='form-label'>
                                        Remarks(कैफियत):
                                    </label>
                                    <textarea type="text" className='form-control rounded-0'
                                        id='inputDate' value={duty.remarks}
                                        onChange={(e) => setDuty({ ...duty, remarks: e.target.value })}>
                                    </textarea>
                                </div>
                                <div className="row">
                                    <div className="col-5 mt-2">
                                        <button className="btn btn-primary w-100" >
                                            Add
                                        </button>
                                    </div>
                                    <div className="col-5 mt-2">
                                        <div className="btn btn-secondary w-100">
                                            clear
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-auto col-md-6 col-xl-6  px-o p-0 m-0">
                        {/* <p className='m-0 mt-1 p-1 btn btn-success' onClick={handleNews}>News</p> */}
                        <div className="p-2 mb-4 d-flex justify-content-center shadow">
                            <h3>सबै ड्युटीहरु</h3>
                        </div>
                        <DoDuties />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Doo