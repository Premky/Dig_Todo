import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import Select from 'react-select';

import Icon from '../Utils/Icon';

import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteConfirmationModal from '../Utils/ConfirmDeleteModal';
import XportRajaswa from './XportRajaswa';

const PunishmentActionForm = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [fetchedOffice, setFetchedOffice] = useState([]);

    const [fetchedPunishment, setFetchedPunishment] = useState([]);
    const [currentPunishment, setCurrentPunishment] = useState([]);
    const [fetchedVehicles, setFetchedVehicles] = useState([]);


    const fetchvehicles = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/vehicles`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.name_np
                }));
                setFetchedVehicles(options);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchPunishment = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/tango/rajashwa_data`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.name_np
                }));
                setFetchedPunishment(result.data.Result);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

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
                ? `${BASE_URL}/tango/update_rajashwa/${currentPunishment.id}`
                : `${BASE_URL}/tango/add_rajashwa`;
            const method = editing ? 'PUT' : 'POST';
    
            const result = await axios({
                method,
                url,
                data,
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (result.data.Status) {
                alert(`Record ${editing ? 'updated' : 'added'} successfully!`);
                await reset(); // Clear the form after submission
                setEditing(false);
                fetchPunishment(); // Refresh the punishment list
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
        setCurrentPunishment(data); // Set the current punishment data
        setEditing(true); // Enable editing mode
    
        // Use setValue to populate the form fields
        setValue("date", convertToNepaliDate(data.date)); // Convert and set Nepali date
        setValue("vehicle_id", data.vehicle_id); // Set the vehicle ID
        setValue("count", data.count); // Set count value
        setValue("fine", data.fine); // Set fine value
        
    };
    

    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0]; // Extract just the date part
        return datePart; // Return in the format needed for the NepaliDatePicker
    };

    const handleDelete = async (id) => {
        try {
            const url = `${BASE_URL}/tango/delete_rajashwa/${id}`;
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
            fetchChange();
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
        fetchPunishment();
        fetchvehicles();
        fetchOffice();

    }, [BASE_URL]);

    const exp_office_name=localStorage.getItem('oid')

    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="p-2 justify-content shadow text-center">
                            <u>
                                <h4> दैनिक राजश्व विवरण</h4>
                            </u>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="d-flex flex-column px-3 pt-0">
                            <form className='row mt-1 g-3'>

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
                                    <label htmlFor="vehicle_id">गाडी<span>*</span></label>
                                    <Controller
                                        name="vehicle_id"
                                        control={control} // This should come from useForm() hook
                                        rules={{ required: "This field is required" }}
                                        defaultValue=""
                                        render={({ field: { onChange, value, ref } }) => (
                                            <Select
                                                inputRef={ref} // Set ref to react-select input
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={fetchedVehicles.find(option => option.value === value) || null} // Match selected option
                                                onChange={(selectedOption) => {
                                                    onChange(selectedOption ? selectedOption.value : ""); // Update form value
                                                }}
                                                isClearable={true} // Correct boolean format
                                                isSearchable={true}
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
                                        <button type="submit" className="btn btn-primary" disabled={loading} onClick={handleSubmit(onFormSubmit)} >
                                            {loading ? 'Submitting...' : editing ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                    <div className="col-4 mb-3">
                                        <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                                    </div>


                                </div>
                            </form>

                            <div className="row p-2 mt-3">
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>सि.नं.</TableCell>
                                                <TableCell>मिति</TableCell>
                                                <TableCell>गाडी</TableCell>
                                                <TableCell>संख्या</TableCell>
                                                <TableCell>राजस्व</TableCell>                                                
                                                <TableCell>#  <div onClick={()=>XportRajaswa(fetchedPunishment,exp_office_name)}>Export</div></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedPunishment.map((row, index) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{index+1}</TableCell>
                                                    <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                    <TableCell>{row.name_np}</TableCell>
                                                    <TableCell>{row.count}</TableCell>                                                    
                                                    <TableCell>{row.fine}</TableCell>
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
                                                                    <b>{row.name_np} = {row.count} = {row.fine} 
                                                                        {/* {convertToNepaliDate(row.date)} */}
                                                                        </b>
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

export default PunishmentActionForm