import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import Select from 'react-select';

import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import XportKasurReport from '../XportKasurReport';

const KasurReport = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [fetchedOffice, setFetchedOffice] = useState([]);
    const [fetchedPunishment, setFetchedPunishment] = useState([]);
    const [fetchedPunishmentXport, setFetchedPunishmentXport] = useState([]);
    const [currentOffice, setCurrentOffice] = useState({});
    const [fetchedKasur, setFetchedKasur] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchPunishment();
        fetchKasur();
        fetchCurrentOffice();
    }, [BASE_URL]);

    const fetchCurrentOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/currentoffice/${localStorage.getItem('oid')}`, 
            {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
            if (result.data.Status) setCurrentOffice(result.data.Result[0]);
            else console.error(result.data.Error);
        } catch (err) {
            console.error('Error fetching current office:', err);
        }
    };

    const fetchKasur = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/tango/kashurs`, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({ value: opt.id, label: opt.name_np }));
                setFetchedKasur(options);
            } else {
                console.error(result.data.Error);
            }
        } catch (err) {
            console.error('Error fetching Kasur data:', err);
        }
    };

    const fetchPunishment = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/tango/search_kasur`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const groupedData = result.data.Result.reduce((acc, item) => {
                    if (!acc[item.office_name]) acc[item.office_name] = { office_name: item.office_name, vehicles: {} };
                    acc[item.office_name].vehicles[item.name_np] = { count: item.count, fine: item.fine };
                    return acc;
                }, {});
                setFetchedPunishment(Object.values(groupedData));
                setFetchedPunishmentXport(result.data.Result);
            } else {
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
            const result = await axios.get(`${BASE_URL}/tango/search_kasur?${queryString}`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const groupedData = result.data.Result.reduce((acc, item) => {
                    if (!acc[item.office_name]) acc[item.office_name] = { office_name: item.office_name, vehicles: {} };
                    acc[item.office_name].vehicles[item.name_np] = { count: item.count, fine: item.fine };
                    return acc;
                }, {});
                setFetchedPunishment(Object.values(groupedData));
                setFetchedPunishmentXport(result.data.Result);
            } else {
                console.error(result.data.Error);
            }
        } catch (err) {
            console.error('Form submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    const convertToNepaliDate = (isoDate) => isoDate.split('T')[0];

    return (
        <div className="container-fluid p-0">
            <div className="row">
                <div className="col-12 text-center">
                    <div className="p-2 shadow">
                        <h4>कसुर रिपोर्ट</h4>
                    </div>
                </div>

                <div className="col-12">
                    <form className="row mt-1 g-3" onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="col-xl-3 col-md-4 col-sm-12">
                            <label htmlFor="date">मिति<span>*</span></label>
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: "This field is required" }}
                                render={({ field }) => (
                                    <NepaliDatePicker
                                        {...field}
                                        value={field.value || ""}
                                        dateFormat="YYYY-MM-DD"
                                        placeholder="Select Nepali Date"
                                    />
                                )}
                            />
                            {errors.date && <span>{errors.date.message}</span>}
                        </div>

                        {/* <div className="col-xl-3 col-md-4 col-sm-12">
                            <label htmlFor="kasur_id">कसुर<span>*</span></label>
                            <Controller
                                name="kasur_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={fetchedKasur}
                                        isClearable
                                        isSearchable
                                    />
                                )}
                            />
                        </div> */}

                        <div className="col-xl-3 col-md-4 col-sm-12">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>

                    <TableContainer component={Paper} className="p-2 mt-3">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" rowSpan={2}>कार्यालय</TableCell>
                                    {fetchedPunishmentXport.map((vehicle, index) => (
                                        <TableCell key={index} colSpan={2} align="center">{vehicle.name_np}</TableCell>
                                    ))}
                                    <TableCell rowSpan={2} align="center">
                                        <div onClick={() => {
                                            if (fetchedPunishmentXport.length && currentOffice?.office_name) {
                                                XportKasurReport(fetchedPunishment, currentOffice.office_name);
                                            }
                                        }}>
                                            Export
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    {fetchedPunishmentXport.map((_, index) => (
                                        <React.Fragment key={index}>
                                            <TableCell align="center">संख्या</TableCell>
                                            <TableCell align="center">राजश्व</TableCell>
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fetchedPunishment.map((office, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell align="center">{office.office_name}</TableCell>
                                        {fetchedPunishmentXport.map((vehicle, colIndex) => {
                                            const vehicleData = office.vehicles[vehicle.name_np] || { count: '-', fine: '-' };
                                            return (
                                                <React.Fragment key={colIndex}>
                                                    <TableCell align="center">{vehicleData.count}</TableCell>
                                                    <TableCell align="center">{vehicleData.fine}</TableCell>
                                                </React.Fragment>
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
    );
};
export default KasurReport;