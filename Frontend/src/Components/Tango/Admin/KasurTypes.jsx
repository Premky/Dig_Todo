import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import Select from 'react-select';

import Icon from '../../Utils/Icon';

import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteConfirmationModal from '../../Utils/ConfirmDeleteModal';
import XportRajaswa from '../XportRajaswa';

const KasurForm = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [fetchedOffice, setFetchedOffice] = useState([]);

        
    const [fetchedDatas, setFetchedDatas] = useState([]);
    const [currentData, setCurrentData] = useState([]);

    const token = localStorage.getItem("token");

    const fetchvehicles = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/tango/kashurs`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                // const options = result.data.Result.map(opt => ({
                //     value: opt.id,
                //     label: opt.name_np
                // }));
                setFetchedDatas(result.data.Result);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onFormSubmit = async (data) => {
        setLoading(true);
        try {
            const url = editing
                ? `${BASE_URL}/tango/update_kasur/${currentData.id}`
                : `${BASE_URL}/tango/add_kasur`;
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
                fetchedDatas();
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
        setCurrentData(data); // Set the current punishment data
        setEditing(true); // Enable editing mode
        setValue("name_np", data.name_np); // Set the vehicle ID
        setValue("name_en", data.name_en); // Set the vehicle ID
    };


    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0]; // Extract just the date part
        return datePart; // Return in the format needed for the NepaliDatePicker
    };

    const handleDelete = async (id) => {
        try {
            const url = `${BASE_URL}/tango/delete_kasur/${id}`;
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
        fetchvehicles();
    }, [BASE_URL]);

    const exp_office_name = localStorage.getItem('oid')

    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="p-2 justify-content shadow text-center">
                            <u>
                                <h4> सवारी साधनहरु</h4>
                            </u>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="d-flex flex-column px-3 pt-0">
                            <form className='row mt-1 g-3'>


                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="name_np"> सवारी साधन प्रकार </label>
                                    <input
                                        type='text'
                                        {...register('name_np', { required: "This field is required." })}
                                        placeholder="कार/जिप/ट्रक"
                                        className="form-control"
                                    />
                                    {errors.name_np && <span>{errors.name_np.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="name_en"> Vehicle Type </label>
                                    <input
                                        type='text'
                                        {...register('name_en', { required: "This field is required." })}
                                        placeholder="Car/Jeep/Truck"
                                        className="form-control"
                                    />
                                    {errors.name_en && <span>{errors.name_en.message}</span>}
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
                                                <TableCell>कसुर</TableCell>
                                                <TableCell>Crime</TableCell>
                                                <TableCell># </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedDatas.map((row, index) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{index + 1}</TableCell>                                                    
                                                    <TableCell>{row.name_np}</TableCell>
                                                    <TableCell>{row.name_en}</TableCell>
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
                                                                    <b>{row.name_np} = {row.name_en} 
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

export default KasurForm