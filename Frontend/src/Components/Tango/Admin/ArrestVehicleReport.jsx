import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import Select from 'react-select';
import Icon from '../../Utils/Icon';

import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import XportArrestVehicles from '../XportArrestVehicles';

const ArrestVehicleReport = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);

    const [fetchedOffice, setFetchedOffice] = useState([]);
    const [fetchedArrestedVehicle, setFetchedArrestedVehicle] = useState([]);
    const [fetchedArrestedVehicleXport, setFetchedArrestedVehicleXport] = useState([]);
    const [currentOffice, setCurrentOffice] = useState({});
    const [fetchedVehicle, setFetchedVehicle] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchArrestVehicles();
        fetchVehicle();
        fetchCurrentOffice();
    }, [BASE_URL]);

    const fetchCurrentOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/currentoffice/${localStorage.getItem('oid')}`);
            if (result.data.Status) {
                setCurrentOffice(result.data.Result[0])
                // console.log(currentOffice)
            }
            else {console.error(result.data.Error)};
        } catch (err) {
            console.error('Error fetching current office:', err);
        }
    };

    const fetchVehicle = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/tango/vehicles`, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({ value: opt.id, label: opt.name_np }));
                setFetchedVehicle(options);
            } else {
                console.error(result.data.Error);
            }
        } catch (err) {
            console.error('Error fetching Kasur data:', err);
        }
    };

    const fetchArrestVehicles = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/tango/arrest_vehicle`, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
    
            if (result.data.Status) {
                console.log("Arrest Vehicles Data:", result.data.Result);
                setFetchedArrestedVehicle(result.data.Result);
                setFetchedArrestedVehicleXport(result.data.Result);
            } else {
                console.error("Backend Error:", result.data.Error);
                alert(`Backend Error: ${result.data.Error}`);
            }
        } catch (err) {
            console.error("Fetch Arrest Vehicles Error:", err);
            alert(`Error fetching arrest vehicles: ${err.message}`);
        }
    };
    

    const onFormSubmit = async (data) => {
        setLoading(true);
    
        try {
            // Filter out undefined or null values from `data`
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value != null && value !== '')
            );
    
            // Convert filtered data to query string
            const queryString = new URLSearchParams(filteredData).toString();
    
            // Make GET request to the backend
            const result = await axios.get(`${BASE_URL}/tango/search_arrest_vehicle?${queryString}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (result.data.Status) {
                console.log(result.data.Result);
                // Update state with fetched data
                setFetchedArrestedVehicle(result.data.Result);
                setFetchedArrestedVehicleXport(result.data.Result); // Optional: Combine these if identical
            } else {
                console.error('API Error:', result.data.Error);
                alert(`Error: ${result.data.Error}`); // User-friendly message
            }
        } catch (err) {
            console.error('Form submission error:', err);
            alert('An error occurred while submitting the form. Please try again.');
        } finally {
            setLoading(false); // Always reset loading state
        }
    };
    
    const convertToNepaliDate = (isoDate) => isoDate.split('T')[0];

    return (
        <div className="container-fluid p-0">
            <div className="row">
                <div className="col-12 text-center">
                    <div className="p-2 shadow">
                        <h4>पक्राउ परेका सवारी साधन रिपोर्ट</h4>
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
                            <label htmlFor="vehicle">सवारी साधन<span>*</span></label>
                            <Controller
                                name="vehicle"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={fetchedVehicle}
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

                    <div className="row p-2 mt-3">
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='text-center bg-success' colSpan={9}>सवारी विवरण</TableCell>
                                                <TableCell className='text-center'></TableCell>
                                                <TableCell className='text-center bg-warning' colSpan={4}>सवारी फिर्ता लग्नेको विवरण</TableCell>
                                                <TableCell className='text-center' colSpan={2}>#</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>सि.नं.</TableCell>
                                                <TableCell>मिति</TableCell>
                                                <TableCell>दर्जा</TableCell>
                                                <TableCell>नामथर</TableCell>
                                                <TableCell>सवारी नं.</TableCell>
                                                <TableCell>कसुर</TableCell>
                                                <TableCell>सवारी चाल/धनी</TableCell>
                                                <TableCell>सम्पर्क नं.</TableCell>
                                                <TableCell>चिट नं.</TableCell>
                                                <TableCell>कैफियत</TableCell>
                                                <TableCell>मिति</TableCell>
                                                <TableCell>नामथर</TableCell>
                                                <TableCell>ठेगाना</TableCell>
                                                <TableCell>सम्पर्क</TableCell>
                                                <TableCell>
                                                    <div onClick={() => XportArrestVehicles(fetchedArrestedVehicle, currentOffice)}>Export</div>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedArrestedVehicle.map((row, index) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                    <TableCell>{row.rank_id}</TableCell>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell>{row.vehicle_no}</TableCell>
                                                    <TableCell>{row.name_np}</TableCell>
                                                    <TableCell>{row.owner}</TableCell>
                                                    <TableCell>{row.contact}</TableCell>
                                                    <TableCell>{row.voucher}</TableCell>
                                                    <TableCell>{row.remarks}</TableCell>
                                                    <TableCell>{row.return_date}</TableCell>
                                                    <TableCell>{row.return_name}</TableCell>
                                                    <TableCell>{row.return_address}</TableCell>
                                                    <TableCell>{row.return_contact}</TableCell>                                                    
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                </div>
            </div>
        </div>
    );
};
export default ArrestVehicleReport;