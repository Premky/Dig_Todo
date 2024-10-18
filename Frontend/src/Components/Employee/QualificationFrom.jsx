import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';

import './formstyle.css'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';


const QualificationFrom = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [fetchEmp, setFetchEmp] = useState([]);

    const [fetchEdu, setFetchEdu] = useState([]);

    const fetchEmployee = ()=>{
        try{
            const result = await axios.get(`${BASE_URL}/display/`)
        }
    }

    const onFormSubmit=()=>{
        console.log('onformsubmit')
    }
    const handleClear = (e) => {
        e.preventDefault();
        reset();
        setEditing(false);                
    }
    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="p-2 pt-0 justify-content shadow text-center">
                            <u>
                                <h4>{editing ? 'Edit Employee' : 'Add Employee'}</h4>
                            </u>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="d-flex flex-column px-3 pt-0">
                            <form className="row mt-1 g-3" >
                                <div className="col-xl-3 col-md-6 col-sm-12">
                                    <label htmlFor="gender">लिंङ्ग</label>
                                    <select {...register('gender')} className="form-select" placeholder="Select Rank">
                                        <option value="">Gender</option>
                                        <option key='M' value='M'>    पुरुष  </option>
                                        <option key='F' value='F'>    महिला  </option>
                                        <option key='O' value='O'>    अन्य  </option>
                                    </select>
                                    {errors.gender && <span>{errors.gender.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12">
                                    <label htmlFor="dob">जन्म मिति<span>*</span></label>
                                    <Controller
                                        name="dob"
                                        control={control}
                                        rules={{ required: "This field is required" }}

                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <NepaliDatePicker
                                                value={value || ""} // Ensure empty string when no date is selected
                                                onChange={(date) => {
                                                    onChange(date); // Update form state
                                                    setSelectedDay(date); // Update local state
                                                }}
                                                onBlur={onBlur} // Handle blur
                                                dateFormat="YYYY-MM-DD" // Customize your date format
                                                placeholder="Select Nepali Date"
                                                ref={ref} // Use ref from react-hook-form
                                            />
                                        )}
                                    />
                                    {errors.dob && <span>{errors.dob.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12">
                                    <label htmlFor="symbol_no">संकेत नं.<span>*</span></label>
                                    <input
                                        {...register('symbol_no', { required: "This field is required." })}
                                        placeholder="संकेत नं."
                                        className="form-control"
                                    />
                                    {errors.symbol_no && <span>{errors.symbol_no.message}</span>}
                                </div>

                      
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary" disabled={loading} onClick={handleSubmit(onFormSubmit)} >
                                        {loading ? 'Submitting...' : editing ? 'Update Employee' : 'Add Employee'}
                                    </button>
                                    <div className="col mb-3">
                                        <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                                    </div>
                                </div>
                            </form>

                            <div className="row p-2 mt-3">
                                <ul className="list-group">
                                    {fetchEdu.map(emp => (
                                        <li key={emp.emp_id} className="list-group-item">{emp.name_np}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default QualificationFrom