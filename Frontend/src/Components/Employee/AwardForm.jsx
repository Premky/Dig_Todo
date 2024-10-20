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

const AwardForm = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [fetchedEmp, setFetchedEmp] = useState([]);

    const [fetchedAward, setFetchedAward] = useState([]);
    const [currentAward, setCurrentAward] = useState([]);
    const [fetchedOffice, setFetchedOffice] = useState([]);

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

    const fetchAward = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/award/${pmis}`);
            if (result.data.Status) {
                setFetchedAward(result.data.Result);
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

    const onFormSubmit = async (data) => {
        setLoading(true);
        try {
            const url = editing
                ? `${BASE_URL}/emp/update_award/${currentAward.id}`
                : `${BASE_URL}/emp/add_award`;
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
                fetchAward();
            }
        } catch (err) {
            console.error('Form submission error:', err);
            alert(err)
            // alert('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (award) => {
        setCurrentAward(award);
        setEditing(true);
        setValue("pmis", award.pmis);
        setValue("name", award.name);
        setValue("office_id", award.office_id);
        // Converting dates to correct Nepali date format
        const date = convertToNepaliDate(award.date);
        // Set the converted dates to the form
        setValue("date", date); // Use the converted start date    
        setValue("prize", award.prize);
        setValue("sn", award.sn);
        setValue("remarks", award.remarks);
    };

    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0]; // Extract just the date part
        return datePart; // Return in the format needed for the NepaliDatePicker
    };

    const handleDelete = async (id) => {
        try {
            const url = `${BASE_URL}/emp/delete_award/${id}`;
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
            fetchAward();
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
        fetchAward();
        fetchEmployee();
        fetchOffice();
    }, [BASE_URL]);

    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="p-2 justify-content shadow text-center">
                            <u>
                                <h4>पुरस्कार विवरण</h4>
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
                                    <label htmlFor="name"> पुरस्कारको नाम </label>
                                    <input
                                        {...register('name', { required: "This field is required." })}
                                        placeholder="पुरस्कारको नाम"
                                        className="form-control"
                                    />
                                    {errors.name && <span>{errors.name.message}</span>}
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
                                    <label htmlFor="prize"> रकम(रु)/ग्रेड </label>
                                    <input
                                        {...register('prize', { required: "This field is required." })}
                                        placeholder="रकम(रु)/ग्रेड"
                                        className="form-control"
                                    />
                                    {errors.prize && <span>{errors.prize.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="sn"> चलानी नं. </label>
                                    <input
                                        {...register('sn', { required: "This field is required." })}
                                        placeholder="चलानी नं."
                                        className="form-control"
                                    />
                                    {errors.sn && <span>{errors.sn.message}</span>}
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
                                            {loading ? 'Submitting...' : editing ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                    <div className="col-4 mb-3">
                                        <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                                    </div>

                                    <div className="col-2 mb-3 btn btn-success" onClick={() => navigate(`/emp/decoration-form/${pmis}`)}>
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
                                                <TableCell>पुरस्कार विवरण</TableCell>
                                                <TableCell>पुरस्कार दिने कार्यालय</TableCell>
                                                <TableCell>प्राप्त मिति</TableCell>
                                                <TableCell>रकम(रु)/ग्रेड</TableCell>
                                                <TableCell>चलानी नं.</TableCell>
                                                <TableCell>Remarks</TableCell>
                                                <TableCell>#</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedAward.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.pmis}</TableCell>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell>{row.office_name}</TableCell>
                                                    <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                    <TableCell>{row.prize}</TableCell>
                                                    <TableCell>{row.sn}</TableCell>
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
                                                                    <b>{row.name}| {row.office_name} | {row.prize}</b>
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

export default AwardForm