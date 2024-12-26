import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import Select from 'react-select';

import Icon from '../../Utils/Icon';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteConfirmationModal from '../../Utils/ConfirmDeleteModal';
import XportRajaswa from '../XportRajaswa';

const PunishmentActionForm = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("token");
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [fetchedOffice, setFetchedOffice] = useState([]);
    const [fetchedPunishment, setFetchedPunishment] = useState([]);
    const [currentPunishment, setCurrentPunishment] = useState([]);
    const [fetchedVehicles, setFetchedVehicles] = useState([]);
    const [currentOffice, setCurrentOffice] = useState([]);

    const fetchCurrentOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/currentoffice/${exp_office_name}`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                setCurrentOffice(result.data.Result[0]);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const fetchVehicles = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/vehicles`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.name_np
                }));
                setFetchedVehicles(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchPunishment = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/tango/rajashwa_data`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (result.data.Status) {
                setFetchedPunishment(result.data.Result);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/offices`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
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
                ? `${BASE_URL}/tango/update_rajashwa/${currentPunishment.id}`
                : `${BASE_URL}/tango/add_rajashwa`;
            const method = editing ? 'PUT' : 'POST';

            const result = await axios({
                method,
                url,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (result.data.Status) {
                alert(`Record ${editing ? 'updated' : 'added'} successfully!`);
                reset();
                setEditing(false);
                fetchPunishment();
            } else {
                alert(result.data.Error || 'Failed to submit the form.');
            }
        } catch (err) {
            console.error('Form submission error:', err);
            alert('Error occurred during form submission.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (data) => {
        setCurrentPunishment(data);
        setEditing(true);
        setValue("date", convertToNepaliDate(data.date));
        setValue("vehicle_id", data.vehicle_id);
        setValue("count", data.count);
        setValue("fine", data.fine);
    };

    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0];
        return datePart;
    };

    const handleDelete = async (id) => {
        try {
            const url = `${BASE_URL}/tango/delete_rajashwa/${id}`;
            const result = await axios.delete(url);
            if (result.data.Status) {
                alert('Record deleted successfully.');
                fetchPunishment();
            } else {
                alert('Failed to delete record.');
            }
        } catch (err) {
            console.log(err);
            alert('Error occurred while deleting the record.');
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        reset();
        setEditing(false);
        setLoading(false);
    };

    useEffect(() => {
        fetchPunishment();
        fetchVehicles();
        fetchOffice();
        fetchCurrentOffice();
    }, []);

    const exp_office_name = localStorage.getItem('oid');

    return (
        <div className="container-fluid p-0">
            <div className="row">
                <div className="col-12">
                    <div className="p-2 justify-content shadow text-center">
                        <u><h4> दैनिक राजश्व विवरण</h4></u>
                    </div>
                </div>
                <div className="col-12">
                    <div className="d-flex flex-column px-3 pt-0">
                        <form className='row mt-1 g-3' onSubmit={handleSubmit(onFormSubmit)}>
                            <div className="col-xl-3 col-md-4 col-sm-12">
                                <label htmlFor="date">मिति<span>*</span></label>
                                <Controller
                                    name="date"
                                    control={control}
                                    rules={{ required: "This field is required" }}
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <NepaliDatePicker
                                            value={value || ""}
                                            onChange={(date) => onChange(date)}
                                            onBlur={onBlur}
                                            dateFormat="YYYY-MM-DD"
                                            placeholder="Select Nepali Date"
                                        />
                                    )}
                                />
                                {errors.date && <span>{errors.date.message}</span>}
                            </div>
                            <div className="col-xl-3 col-md-4 col-sm-12">
                                <label htmlFor="vehicle_id">गाडी<span>*</span></label>
                                <Controller
                                    name="vehicle_id"
                                    control={control}
                                    rules={{ required: "This field is required" }}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <Select
                                            inputRef={ref}
                                            className='basic-single'
                                            classNamePrefix='select'
                                            value={fetchedVehicles.find(option => option.value === value) || null}
                                            onChange={(selectedOption) => onChange(selectedOption ? selectedOption.value : "")}
                                            isClearable
                                            isSearchable
                                            options={fetchedVehicles}
                                        />
                                    )}
                                />
                                {errors.vehicle_id && <span>{errors.vehicle_id.message}</span>}
                            </div>
                            <div className="col-xl-3 col-md-4 col-sm-12">
                                <label htmlFor="count"> संख्या </label>
                                <input
                                    type='number'
                                    {...register('count', { required: "This field is required." })}
                                    placeholder="संख्या"
                                    className="form-control"
                                />
                                {errors.count && <span>{errors.count.message}</span>}
                            </div>
                            <div className="col-xl-3 col-md-4 col-sm-12">
                                <label htmlFor="fine"> राजस्व </label>
                                <input
                                    type='number'
                                    {...register('fine', { required: "This field is required." })}
                                    placeholder="राजस्व"
                                    className="form-control"
                                />
                                {errors.fine && <span>{errors.fine.message}</span>}
                            </div>
                            <div className="col-12 row mt-2">
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Submitting...' : editing ? 'Update' : 'Add'}
                                    </button>
                                </div>
                                <div className="col-4 mb-3">
                                    <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <TableContainer component={Paper}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Vehicle</TableCell>
                                    <TableCell>Count</TableCell>
                                    <TableCell>Fine</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fetchedPunishment.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                        <TableCell>{row.vehicle_id}</TableCell>
                                        <TableCell>{row.count}</TableCell>
                                        <TableCell>{row.fine}</TableCell>
                                        <TableCell>
                                            <button onClick={() => handleEdit(row)} className="btn btn-sm btn-primary mx-1">Edit</button>
                                            <DeleteConfirmationModal onDelete={() => handleDelete(row.id)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <button className='btn btn-outline-dark my-2' onClick={() => XportRajaswa(fetchedPunishment, currentOffice?.office_name)}>Export</button>
                </div>
            </div>
        </div>
    );
};

PunishmentActionForm.propTypes = {
    pmis: PropTypes.string,
};

export default PunishmentActionForm;
