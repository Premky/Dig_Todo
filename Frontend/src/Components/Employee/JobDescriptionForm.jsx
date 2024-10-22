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

const JobDescriptionForm = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [fetchedEmp, setFetchedEmp] = useState([]);

    const [fetchedJd, setFetchedJd] = useState([]);
    const [currentJd, setCurrentJd] = useState([]);
    const [fetchedOffice, setFetchedOffice] = useState([]);
    const [fetchedJobs, setFetchedJobs] = useState([]);
    const [fetchedRanks, setFetchedRanks] = useState([]);
    const [fetchedGroups, setFetchedGroups] = useState([]);

    const fetchEmployee = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/employee/${pmis}`);
            if (result.data.Status) {
                setFetchedEmp(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchJd = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/jd/${pmis}`);
            if (result.data.Status) {
                setFetchedJd(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/offices`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.o_id,
                    label: opt.office_name
                }));
                setFetchedOffice(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchRank = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/ranks`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.rank_id,
                    label: opt.rank_np,
                    label_en: opt.rank_en
                }));
                setFetchedRanks(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchgroups = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/emp_groups`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.name,
                    label_en: opt.name_en
                }));
                setFetchedGroups(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchJobs = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/jobs`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.name,
                    label_en: opt.name_en
                }));
                setFetchedJobs(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onFormSubmit = async (data) => {
        setLoading(true);
        try {
            const url = editing
                ? `${BASE_URL}/emp/update_jd/${currentJd.id}`
                : `${BASE_URL}/emp/add_jd`;
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
                fetchJd();
            }
        } catch (err) {
            console.error('Form submission error:', err);
            alert(err)
            // alert('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (data) => {
        setCurrentJd(data);
        setEditing(true);
        setValue("pmis", data.pmis);
        setValue("rank_id", data.rank_id);
        setValue("group_id", data.group_id);
        setValue("job_done_id", data.job_done_id);
        setValue("office_id", data.office_id);
        // Converting dates to correct Nepali date format
        const date = convertToNepaliDate(data.date);
        setValue("date", date); // Use the converted start date    
        setValue("deputation_id", data.deputation_id);
        setValue("remarks", data.remarks);
    };

    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0]; // Extract just the date part
        return datePart; // Return in the format needed for the NepaliDatePicker
    };

    const handleDelete = async (id) => {
        try {
            const url = `${BASE_URL}/emp/delete_jd/${id}`;
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
            fetchJd();
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
        fetchJd();
        fetchEmployee();
        fetchOffice();
        fetchRank();
        fetchgroups();
        fetchJobs();
    }, [BASE_URL]);

    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="p-2 justify-content shadow text-center">
                            <u>
                                <h4> नोकरी विवरण</h4>
                            </u>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        {fetchedEmp && fetchedEmp.length > 0 ? (
                            <div className="row">
                                {fetchedEmp.map(emp => (
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
                            <form className='row mt-1 g-3'>

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
                                    <label htmlFor="rank_id">दर्जा<span>*</span></label>
                                    <select {...register('rank_id')} className="form-select" placeholder="Select Rank">
                                        <option value="">Select</option>
                                        {fetchedRanks.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.rank_id && <span>{errors.rank_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="group_id">सेवा समुह<span>*</span></label>
                                    <select {...register('group_id')} className="form-select" placeholder="Select Rank">
                                        <option value="">Select</option>
                                        {fetchedGroups.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.group_id && <span>{errors.group_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="job_done_id">क्रियाकलाप<span>*</span></label>
                                    <select {...register('job_done_id')} className="form-select" placeholder="Select Rank">
                                        <option value="">Select</option>
                                        {fetchedJobs.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.job_done_id && <span>{errors.job_done_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="office_id">अफिस<span>*</span></label>
                                    <select {...register('office_id')} className="form-select" placeholder="Select Rank">
                                        <option value="">Select</option>
                                        {fetchedOffice.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.office_id && <span>{errors.office_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="date">मिति<span>*</span></label>
                                    <Controller
                                        name="date"
                                        control={control}
                                        rules={{ required: "This field is required" }}
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <NepaliDatePicker
                                                value={value || ""} // Ensure empty string when no date is selected
                                                onChange={(date) => {
                                                    onChange(date); // Update form state
                                                }}
                                                onBlur={onBlur} // Handle blur
                                                dateFormat="YYYY-MM-DD" // Customize your date format
                                                placeholder="Select Nepali Date"
                                            // ref={ref} // Use ref from react-hook-form
                                            />
                                        )}
                                    />
                                    {errors.date && <span>{errors.date.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="deputation_id">दरबन्दी<span>*</span></label>
                                    <select {...register('deputation_id')} className="form-select" placeholder="Select Rank">
                                        <option value="">Select</option>
                                        {fetchedOffice.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.deputation_id && <span>{errors.deputation_id.message}</span>}
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
                                    <div className="col-2 mb-3 btn btn-success" onClick={() => navigate(`/emp/punishment-form/${pmis}`)}>
                                        Previous
                                    </div>
                                    <div className="col-4">
                                        <button type="submit" className="btn btn-primary" disabled={loading} onClick={handleSubmit(onFormSubmit)} >
                                            {loading ? 'Submitting...' : editing ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                    <div className="col-4 mb-3">
                                        <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                                    </div>

                                    <div className="col-2 mb-3 btn btn-success" onClick={() => navigate(`/emp/job-working-form/${pmis}`)}>
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
                                                <TableCell>दर्जा</TableCell>
                                                <TableCell>सेवा समुह</TableCell>
                                                <TableCell>क्रियाकलाप</TableCell>
                                                <TableCell>कार्यालय</TableCell>
                                                <TableCell>मिति</TableCell>
                                                <TableCell>कायम भएको दरबन्दी</TableCell>
                                                <TableCell>Remarks</TableCell>
                                                <TableCell>#</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedJd.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.pmis}</TableCell>
                                                    <TableCell>{row.rank_np}</TableCell>
                                                    <TableCell>{row.group_name}</TableCell>
                                                    <TableCell>{row.job_name}</TableCell>
                                                    <TableCell>{row.office_name}</TableCell>
                                                    <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                    <TableCell>{row.deputation}</TableCell>
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
                                                                    onConfirm={() => handleDelete(row.id)}>
                                                                    <b>{row.job_name} | {row.office_name} | {convertToNepaliDate(row.date)}</b>
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

export default JobDescriptionForm