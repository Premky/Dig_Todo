import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';

import Icon from '../Utils/Icon';
import './formstyle.css'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteConfirmationModal from '../Utils/ConfirmDeleteModal';

const token = localStorage.getItem("token");

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
    const [fetchedEduLvl, setFetchedEduLvl] = useState([]);
    const [fetchedEduFaculty, setFetchedEduFaculty] = useState([]);
    const [fetchedQualification, setFetchedQualification] = useState([]);
    const [currentEdu, setCurrentEdu] = useState([]);

    const convertToNepaliDate = (isoDate) => {
        if (!isoDate) {
            return 'null';
        } else {
            const datePart = isoDate.split('T')[0]; // Extract just the date part
            return datePart; // Return in the format needed for the NepaliDatePicker)
        }
    }
        ;

    const fetchEmployee = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/employee/${pmis}`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                setFetchEmp(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchQualification = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/qualification/${pmis}`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                setFetchedQualification(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchLevel = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/edu_level/`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                // setFetchedEduLvl(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.edu_lvl_id,
                    label_np: opt.edu_level,
                    label_en: opt.edu_level_en
                }));
                setFetchedEduLvl(options);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchFaculty = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/edu_faculty/`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                // setFetchedEduFaculty(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.edu_fac_id,
                    label_np: opt.edu_faculty,
                    label_en: opt.edu_faculty_en
                }));
                setFetchedEduFaculty(options);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const onFormSubmit = async (data) => {
        setLoading(true);
        try {
            const url = editing
                ? `${BASE_URL}/emp/update_qualification/${currentEdu.edu_id}`
                : `${BASE_URL}/emp/add_qualification`;
            const method = editing ? 'PUT' : 'POST';

            // Make API request
            const result = await axios({
                method,
                url,
                data: data,
                headers: { 'Content-Type': 'application/json' }
            });

            if (result.data.Status) {
                alert(`Record ${editing ? 'updated' : 'added'} for PMIS: ${result.data.pmis} successfully!`);
                reset();
                setEditing(false);
                fetchQualification();
                // If PMIS exists, navigate to the next form
                // if (result.data.pmis) {
                //     navigate(`/emp/training-form/${result.data.pmis}`);
                // }
            }
        } catch (err) {
            console.error('Form submission error:', err);
            alert(err)
            // alert('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (edu_detail) => {
        setCurrentEdu(edu_detail);
        setEditing(true);
        setValue("pmis", edu_detail.pmis);
        setValue("level", edu_detail.level);
        setValue("faculty", edu_detail.faculty);
        setValue("institute", edu_detail.institute);
        setValue("country", edu_detail.country);
        setValue("pass_year", edu_detail.pass_year);
        setValue("rank", edu_detail.edu_rank);
        setValue("gpa", edu_detail.gpa)
        setValue("remarks", edu_detail.remarks);
    };

    const handleDelete = async (id) => {
        try {
            const url = `${BASE_URL}/emp/delete_qualification/${id}`;
            const result = await axios.delete(url);
            if (result.data.Status) {
                alert('Record deleted successfully.');
            } else {
                alert('Failed to delete record.');
            }
        } catch (err) {
            console.log(err);
            alert('Error occurred while deleting the record.');
        } finally {
            fetchQualification();
        }
    };


    const handleClear = (e) => {
        e.preventDefault();
        if (loading) {
            setLoading(false);
        } else {
            reset();
            setEditing(false);
        }
    }

    useEffect(() => {
        fetchEmployee();
        fetchQualification();
        fetchLevel();
        fetchFaculty();
    }, [BASE_URL]);

    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="p-2 justify-content shadow text-center">
                            <u>
                                <h4>शिक्षा विवरण</h4>
                            </u>
                        </div>
                    </div>

                    <div className="col-12 mt-2">
                        {fetchEmp && fetchEmp.length > 0 ? (
                            <div className="row">
                                {fetchEmp.map(emp => (
                                    <div className="col" key={emp.pmis}>
                                        {emp.pmis} ,
                                        {emp.name_np} ,
                                        {emp.symbol_no}
                                    </div>
                                ))}
                            </div>)
                            : (<p>PMIS Not Found...</p>)}
                    </div>

                    <div className="col-12">
                        <div className="d-flex flex-column px-3 pt-0">

                            <form className="row mt-1 g-3" >

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="pmis"> कम्प्युटर कोड (PMIS) </label>
                                    <input
                                        value={pmis}
                                        {...register('pmis', { required: "This field is required." })}
                                        placeholder="Computer Code"
                                        className="form-control"
                                        readOnly
                                    />
                                    {errors.pmis && <span>{errors.pmis.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="level">शैक्षिक उपाधि<span>*</span></label>
                                    <select
                                        {...register('level', { required: "This field is required." })}
                                        className="form-select"
                                        placeholder="Select"
                                    >
                                        <option value=''>Select Level</option>
                                        {/* label_en: opt.edu_level_en */}
                                        {fetchedEduLvl.map((lvl) => (
                                            <option key={lvl.value} value={lvl.value}>
                                                {lvl.label_np}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.level && <span>{errors.level.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="faculty">शैक्षिक संकाय<span>*</span></label>
                                    <select
                                        {...register('faculty', { required: "This field is required." })}
                                        className="form-select"
                                        placeholder="Select"
                                    >
                                        <option value=''>Select Level</option>
                                        {fetchedEduFaculty.map((faculty) => (
                                            <option key={faculty.value} value={faculty.value}>
                                                {faculty.label_np}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.faculty && <span>{errors.faculty.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="institute"> शैक्षिक संस्था </label>
                                    <input
                                        {...register('institute', { required: "This field is required." })}
                                        placeholder="शैक्षिक संस्था"
                                        className="form-control"
                                    />
                                    {errors.institute && <span>{errors.institute.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="country"> देश </label>
                                    <input
                                        {...register('country', { required: "This field is required." })}
                                        placeholder="देश"
                                        className="form-control"
                                    />
                                    {errors.country && <span>{errors.country.message}</span>}
                                </div>

                                <Controller
                                    name="pass_year"
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

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="rank"> श्रेणी/ग्रेड </label>
                                    <input
                                        {...register('rank', { required: "This field is required." })}
                                        placeholder=" 1st / A"
                                        className="form-control"
                                    />
                                    {errors.rank && <span>{errors.rank.message}</span>}
                                </div>


                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="gpa"> प्रतिशत/जि.पि.ए </label>
                                    <input
                                        {...register('gpa', { required: "This field is required." })}
                                        placeholder="प्रतिशत/जि.पि.ए"
                                        className="form-control"
                                    />
                                    {errors.gpa && <span>{errors.gpa.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="remarks"> कैफियत </label>
                                    <input
                                        {...register('remarks', { required: "This field is required." })}
                                        placeholder="कैफियत"
                                        className="form-control"
                                    />
                                    {errors.remarks && <span>{errors.remarks.message}</span>}
                                </div>

                                <div className="col-12 row mt-2">
                                    <div className="col-4">
                                        <button type="submit" className="btn btn-primary" disabled={loading} onClick={handleSubmit(onFormSubmit)} >
                                            {loading ? 'Submitting...' : editing ? 'Update' : 'Save'}
                                        </button>
                                    </div>
                                    <div className="col-4 mb-3">
                                        <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                                    </div>

                                    <div className="col-2 mb-3 btn btn-success" onClick={() => navigate(`/emp/training-form/${pmis}`)}>
                                        {/* <button className='btn btn-success' onClick={() => navigate(`/emp/training-form/${pmis}`)}>Next</button> */}
                                        Next
                                    </div>
                                </div>
                            </form>

                            <div className="row p-2 mt-3">
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>PMIS</TableCell>
                                                <TableCell>Level</TableCell>
                                                <TableCell>Faculty</TableCell>
                                                <TableCell>Institute</TableCell>
                                                <TableCell>Country</TableCell>
                                                <TableCell>Pass Year</TableCell>
                                                <TableCell>Rank</TableCell>
                                                <TableCell>Percentage/GPA</TableCell>
                                                <TableCell>Remarks</TableCell>
                                                <TableCell>#</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedQualification.map((row) => (
                                                <TableRow key={row.edu_id}>
                                                    <TableCell>{row.pmis}</TableCell>
                                                    <TableCell>{row.edu_level}</TableCell>
                                                    <TableCell>{row.edu_faculty}</TableCell>
                                                    <TableCell>{row.institute}</TableCell>
                                                    <TableCell>{row.country}</TableCell>
                                                    <TableCell>{convertToNepaliDate(row.pass_year)}</TableCell>
                                                    <TableCell>{row.edu_rank}</TableCell>
                                                    <TableCell>{row.gpa}</TableCell>
                                                    <TableCell>{row.remarks}</TableCell>
                                                    <TableCell>
                                                        <div className="row">
                                                            <div className="col">
                                                                <button name='edit' className='btn btn-sm bg-primary'
                                                                    onClick={() => handleEdit(row)}>
                                                                    <Icon iconName="Pencil" style={{ color: 'white', fontSize: '1em' }} />
                                                                </button>
                                                            </div>
                                                            <div className="col">

                                                                <DeleteConfirmationModal
                                                                    title={'Are you sure you want to delete this record?'}
                                                                    buttonText={<span><Icon iconName="Trash" style={{ color: 'red', fontSize: '1em' }} /></span>}
                                                                    onConfirm={() => handleDelete(row.edu_id)}>
                                                                    <b>{row.edu_level}| {row.edu_faculty} | {row.institute}</b>
                                                                    <p>This action cannot be undone.</p>
                                                                </DeleteConfirmationModal>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default QualificationFrom