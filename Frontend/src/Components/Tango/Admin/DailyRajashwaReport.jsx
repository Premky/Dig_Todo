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

import XportKasur from '../XportKasur';
import XportData from '../XportKasurReport';
import XportKasurReport from '../XportKasurReport';

const RajashwaReport = () => {
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
    const [fetchedPunishmentXport, setfetchedPunishmentXport] = useState([]);
    const [currentPunishment, setCurrentPunishment] = useState([]);
    const [fetchedKasur, setFetchedKasur] = useState([]);

    const exp_office_name = localStorage.getItem('oid')
    const [currnetOffice, setCurrentOffice] = useState([]);
    const token = localStorage.getItem("token");
    const fetchCurrentOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/currentoffice/${exp_office_name}`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                // console.log(currnetOffice,'office')
                setCurrentOffice(result.data.Result[0]);
                // console.log(result.data.Result);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const fetchKasur = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/tango/kashurs`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.name_np
                }));
                setFetchedKasur(options);
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
            const result = await axios.get(`${BASE_URL}/tango/search_rajashwa`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const groupedData = {};

                result.data.Result.forEach(item => {
                    if (!groupedData[item.office_name]) {
                        groupedData[item.office_name] = { office_name: item.office_name, vehicles: {} };
                    }

                    groupedData[item.office_name].vehicles[item.name_np] = {
                        count: item.count,
                        fine: item.fine,
                    };
                });

                setFetchedPunishment(Object.values(groupedData));
                setfetchedPunishmentXport(result.data.Result);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error);
            }
        } catch (err) {
            console.error('Error fetching punishment data:', err);
        }
    };


    const onFormSubmit = async (data) => {
        setLoading(true);
        try {
            const queryString = new URLSearchParams(data).toString();
            const result = await axios.get(`${BASE_URL}/tango/search_rajashwa?${queryString};`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const groupedData = {};

                result.data.Result.forEach(item => {
                    if (!groupedData[item.office_name]) {
                        groupedData[item.office_name] = { office_name: item.office_name, vehicles: {} };
                    }

                    groupedData[item.office_name].vehicles[item.name_np] = {
                        count: item.count,
                        fine: item.fine,
                    };
                });
                const formattedDataforexport = Object.values(groupedData);
                setFetchedPunishment(Object.values(groupedData));
                setfetchedPunishmentXport(result.data.Result);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error);
            }
        } catch (err) {
            console.error('Form submission error:', err);
            alert('Error occurred during form submission.');
        } finally {
            setLoading(false);
        }
    };

    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0]; // Extract just the date part
        return datePart; // Return in the format needed for the NepaliDatePicker
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
        fetchKasur();
        fetchCurrentOffice();
    }, [BASE_URL]);

    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="p-2 justify-content shadow text-center">
                            <u>
                                <h4> राजश्व रिपोर्ट</h4>
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

                                {/* <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="kasur_id">कसुर<span>*</span></label>
                                    <Controller
                                        name="kasur_id"
                                        control={control} // This should come from useForm() hook
                                        // rules={{ required: "This field is required" }}
                                        defaultValue=""
                                        render={({ field: { onChange, value, ref } }) => (
                                            <Select
                                                inputRef={ref} // Set ref to react-select input
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={fetchedKasur.find(option => option.value === value) || null} // Match selected option
                                                onChange={(selectedOption) => {
                                                    onChange(selectedOption ? selectedOption.value : ""); // Update form value
                                                }}
                                                isClearable={true} // Correct boolean format
                                                isSearchable={true}
                                                options={fetchedKasur}
                                            />
                                        )}
                                    />
                                    {errors.kasur_id && <span>{errors.kasur_id.message}</span>}

                                </div> */}
                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <button type="Search" className="btn btn-primary" disabled={loading} onClick={handleSubmit(onFormSubmit)} >
                                        {loading ? 'Searching...' : 'Search'}
                                    </button>
                                </div>
                            </form>

                            <div className="row p-2 mt-3">
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {/* "कार्यालय" header */}
                                                <TableCell align="center" rowSpan={2} style={{ fontWeight: 'bold' }}>कार्यालय</TableCell>

                                                {/* Vehicle Names (each spans 2 columns) */}
                                                {fetchedPunishmentXport.map((vehicle, index) => (
                                                    <TableCell key={index} colSpan={2} align="center" style={{ fontWeight: 'bold' }}>
                                                        {vehicle.name_np}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                            <TableRow>
                                                {/* Sub-headers for Count and Tax/Fine under each vehicle */}
                                                {fetchedPunishmentXport.map((x, index) => (
                                                    <>
                                                        <TableCell key={`${index}-count`} align="center" style={{ fontWeight: 'bold' }}>संख्या</TableCell>
                                                        <TableCell key={`${index}-fine`} align="center" style={{ fontWeight: 'bold' }}>राजश्व</TableCell>
                                                    </>
                                                ))}
                                                <TableCell rowSpan={2}>
                                                    <div onClick={() => {
                                                        if (fetchedPunishmentXport && fetchedPunishmentXport.length > 0 && currnetOffice?.office_name) {
                                                            XportKasurReport(fetchedPunishment, currnetOffice.office_name);
                                                        } else {
                                                            console.warn("Export data or office name is missing!");
                                                        }
                                                    }}>
                                                        Export
                                                    </div>

                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedPunishment.map((office, rowIndex) => (
                                                <TableRow key={rowIndex}>
                                                    {/* Office Name */}
                                                    <TableCell align="center">{office.office_name}</TableCell>

                                                    {/* Render each vehicle's count and fine values */}
                                                    {fetchedPunishmentXport.map((vehicle, colIndex) => {
                                                        const vehicleData = office.vehicles[vehicle.name_np] || { count: '-', fine: '-' };
                                                        return (
                                                            <>
                                                                <TableCell key={`${colIndex}-count`} align="center">{vehicleData.count}</TableCell>
                                                                <TableCell key={`${colIndex}-fine`} align="center">{vehicleData.fine}</TableCell>
                                                            </>
                                                        );
                                                    })}

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

export default RajashwaReport;