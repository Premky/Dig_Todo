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

const ArrestedVehicleForm = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    // const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const { register: registerCrud,
        handleSubmit: handleSubmitCrud,
        reset: resetCrud,
        setValue: setValueCrud,
        formState: { errors: errorsCrud },
        control: controlCrud } = useForm();

    const { register: registerSearch,
        handleSubmit: handleSubmitSearch,
        reset: resetSearch,
        setValue: setValueSearch,
        formState: { errors: errorsSearch },
        control: controlSearch } = useForm();

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [fetchedOffice, setFetchedOffice] = useState([]);

    const [fetchedPunishment, setFetchedPunishment] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [fetchedKasur, setFetchedKasur] = useState([]);

    const exp_office_name = localStorage.getItem('oid')
    const [currnetOffice, setCurrentOffice] = useState([]);

    const fetchCurrentOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/currentoffice/${exp_office_name}`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
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

    const [fetchedRank, setFetchedRank] = useState([]);
    const fetchRank = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/ranks`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.rank_np
                }));
                setFetchedRank(options);
            }
        } catch (error) {
            console.error("Error fetching ranks:", error);
        }
    };

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

    const fetchArrestVehicle = async () => {
        try {
            // console.log(localStorage.getItem("token"))
            const result = await axios.get(`${BASE_URL}/tango/arrest_vehicle`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                });
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.name_np
                }));
                setFetchedPunishment(result.data.Result);
                // console.log(fetchedPunishment);
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
                ? `${BASE_URL}/tango/update_arrest_vehicle/${currentData.sn}`
                : `${BASE_URL}/tango/add_arrested_vehcile`;
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
                resetCrud(); // Clear the form after submission
                setEditing(false);
                fetchArrestVehicle(); // Refresh the list
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
        // console.log(currentPunishment, currentPunishment.id)
        setEditing(true); // Enable editing mode

        // Use setValue to populate the form fields
        setValueCrud("date", convertToNepaliDate(data.date)); // Convert and set Nepali date
        setValueCrud("rank_id", data.rank_id); // Convert and set Nepali date
        setValueCrud("name", data.name); // Convert and set Nepali date
        setValueCrud("vehicle_no", data.vehicle_no); // Convert and set Nepali date        
        setValueCrud("kasur_id", data.kasur_id);
        setValueCrud("owner", data.owner);
        setValueCrud("contact", data.contact);
        setValueCrud("voucher", data.voucher);
        setValueCrud("return_date", data.return_date);
        setValueCrud("return_name", data.return_name);
        setValueCrud("return_address", data.return_address);
        setValueCrud("return_contact", data.return_contact);
        setValueCrud("return_remarks", data.return_remarks);
        setValueCrud("remarks", data.remarks);
    };


    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0]; // Extract just the date part
        return datePart; // Return in the format needed for the NepaliDatePicker
    };

    const handleDelete = async (id) => {
        try {
            const url = `${BASE_URL}/tango/delete_arrest_vehicle/${id}`;
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
            fetchArrestVehicle();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        if (loading) {
            setLoading(false);
        } else {
            resetCrud();
            setEditing(false);
        }
    }

    const onSearch = async (data) => {
        setLoading(true);
        console.log(data)
        try {
            // Filter out undefined or null values from `data`
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value != null && value !== '')
            );
            
            // Convert filtered data to query string
            const queryString = new URLSearchParams(filteredData).toString();
            console.log(queryString)

            // Make GET request to the backend
            const result = await axios.get(`${BASE_URL}/tango/search_arrest_vehicle?${queryString}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
            });

            if (result.data.Status) {
                console.log(result.data.Result);
                // Update state with fetched data
                setFetchedPunishment(result.data.Result);
                // setFetchedArrestedVehicleXport(result.data.Result); // Optional: Combine these if identical
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

    const handleSearchClear = (e) => {
        e.preventDefault();
        if (loading) {
            setLoading(false);
        } else {
            resetSearch();
            fetchArrestVehicle();
            setEditing(false);
        }
    }
    useEffect(() => {
        fetchArrestVehicle();
        fetchKasur();
        fetchCurrentOffice();
        fetchRank();
    }, [BASE_URL]);




    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="col-12">
                            <div className="p-2 justify-content shadow text-center">
                                <u>
                                    <h4> पक्राउ सवारी साधन रजिष्टर</h4>
                                </u>
                            </div>
                        </div>

                        <div className="d-flex flex-column px-3 pt-0">
                            
                            <div className='bg-warning'>नया रेकर्ड थप्नुहोस्</div>

                            <form className='row mt-1 g-3'>
                                
                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="date">मिति<span>*</span></label>
                                     <Controller
                                        name="date"
                                        control={controlCrud}
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
                                    {errorsCrud.date && <span>{errorsCrud.date.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="rank_id">दर्जा<span>*</span></label>

                                    <select {...registerCrud('rank_id')} className="form-select" placeholder="Select Rank">
                                        <option value="">दर्जा छान्नुहोस्</option>
                                        {fetchedRank.map((rank) => (
                                            <option key={rank.rank_id} value={rank.value}>
                                                {rank.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errorsCrud.rank_id && <span>{errorsCrud.rank_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="name"> नामथर </label>
                                    <input
                                        type='name'
                                        {...registerCrud('name', { required: "This field is required." })}
                                        placeholder="प्रहरी कर्मचारीको नामथर"
                                        className="form-control"
                                    />
                                    {errorsCrud.name && <span>{errorsCrud.name.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="vehicle_no"> सवारी नं. </label>
                                    <input
                                        type='text'
                                        {...registerCrud('vehicle_no', { required: "This field is required." })}
                                        placeholder="सवारी नं."
                                        className="form-control"
                                    />
                                    {errorsCrud.vehicle_no && <span>{errorsCrud.vehicle_no.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="kasur_id">कसुर<span>*</span></label>
                                    <Controller
                                        name="kasur_id"
                                        control={controlCrud} // This should come from useForm() hook
                                        rules={{ required: "This field is required" }}
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
                                    {errorsCrud.kasur_id && <span>{errorsCrud.kasur_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="owner"> चालक/धनी </label>
                                    <input
                                        type='text'
                                        {...registerCrud('owner', { required: "This field is required." })}
                                        placeholder="चालक/धनी"
                                        className="form-control"
                                    />
                                    {errorsCrud.owner && <span>{errorsCrud.owner.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="contact"> सम्पर्क नं. </label>
                                    <input
                                        type='number'
                                        {...registerCrud('contact', { required: "This field is required." })}
                                        placeholder="सम्पर्क नं."
                                        className="form-control"
                                    />
                                    {errorsCrud.contact && <span>{errorsCrud.contact.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="voucher"> चिट नं. </label>
                                    <input
                                        type='number'
                                        {...registerCrud('voucher', { required: "This field is required." })}
                                        placeholder="चिट नं."
                                        className="form-control"
                                    />
                                    {errorsCrud.voucher && <span>{errorsCrud.voucher.message}</span>}
                                </div>

                                <div className='bg-warning'>फिर्ता लग्नेको विवरण</div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="return_date">फिर्ता मिति<span>*</span></label>
                                    <Controller
                                        name="return_date"
                                        control={controlCrud}

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
                                    {errorsCrud.return_date && <span>{errorsCrud.return_date.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="return_name"> फिर्ता लग्नेको नामथर </label>
                                    <input
                                        type='text'
                                        {...registerCrud('return_name')}
                                        placeholder=""
                                        className="form-control"
                                    />
                                    {errorsCrud.return_name && <span>{errorsCrud.return_name.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="return_address"> फिर्ता लग्नेको ठेगाना </label>
                                    <input
                                        type='text'
                                        {...registerCrud('return_address')}
                                        placeholder=""
                                        className="form-control"
                                    />
                                    {errorsCrud.return_address && <span>{errorsCrud.return_address.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="return_contact"> फिर्ता लग्नेको सम्पर्क नं. </label>
                                    <input
                                        type='number'
                                        {...registerCrud('return_contact')}
                                        placeholder=""
                                        className="form-control"
                                    />
                                    {errorsCrud.return_contact && <span>{errorsCrud.return_contact.message}</span>}
                                </div>

                                <div className='bg-warning'>केही कैफियत भए</div>
                                <div className="col-xl-6 col-md-6 col-sm-12">
                                    <label htmlFor="remarks">कैफियत</label>
                                    <textarea
                                        {...registerCrud('remarks', {
                                            maxLength: { value: 500, message: 'कैफियत ५०० अक्षर भित्र हुनुपर्छ।' }, // Example validation
                                        })}
                                        placeholder="कैफियत लेख्नुहोस्"
                                        className={`form-control ${errorsCrud.remarks ? 'is-invalid' : ''}`}
                                    />
                                    {errorsCrud.remarks && <span className="text-danger">{errorsCrud.remarks.message}</span>}
                                </div>


                                <div className="col-12 row mt-2">
                                    <div className="col-4">
                                        <button type="submit" className="btn btn-primary" disabled={loading} onClick={handleSubmitCrud(onFormSubmit)} >
                                            {loading ? 'Submitting...' : editing ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                    <div className="col-4 mb-3">
                                        <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                                    </div>
                                </div>
                            </form>

                            <div className='bg-warning'>खोज्नुहोस्</div>
                            <div className="col-12">
                                <form className="row mt-1 g-3" onSubmit={handleSubmitSearch(onSearch)}>
                                    <div className="col-xl-3 col-md-4 col-sm-12">
                                        <label htmlFor="srh_date">मिति<span>*</span></label>
                                        <Controller
                                            name="srh_date"
                                            control={controlSearch}
                                            // rules={{ required: "This field is required" }}
                                            render={({ field }) => (
                                                <NepaliDatePicker
                                                    {...field}
                                                    value={field.value || null}
                                                    dateFormat="YYYY-MM-DD"
                                                    placeholder="Select Nepali Date"
                                                />
                                            )}
                                        />
                                        {/* {searchForm.errors.srh_date && <span>{searchForm.errors.srh_date.message}</span>} */}
                                    </div>

                                    <div className="col-xl-3 col-md-4 col-sm-12">
                                        <label htmlFor="srh_voucher">चिट नं.<span>*</span></label>
                                        <input type="number" name='srh_voucher' className="form-control"
                                            {...registerSearch("srh_voucher")} />
                                        {errorsSearch.srh_voucher && <span>{errorsSearch.srh_voucher.message}</span>}
                                    </div>

                                    <div className="col-xl-3 col-md-4 col-sm-12">
                                        <label htmlFor="srh_contact">सम्पर्क नं.<span>*</span></label>
                                        <input type="number" name='srh_contact' className="form-control"
                                            {...registerSearch("srh_contact")} />
                                        {errorsSearch.srh_contact && <span>{errorsSearch.srh_contact.message}</span>}
                                    </div>
                                    <div className="col-xl-3 col-md-4 col-sm-12">
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Searching...' : 'Search'}
                                        </button>
                                        <button className='btn btn-danger' onClick={handleSearchClear}>
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>

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
                                                    {/* <div onClick={() => XportKasur(fetchedPunishment, currnetOffice)}>Export</div> */}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedPunishment.map((row, index) => (
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
                                                                    onConfirm={() => handleDelete(row.sn)}>
                                                                    <b>{row.name_np} | {row.count} | {row.fine}
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

export default ArrestedVehicleForm;