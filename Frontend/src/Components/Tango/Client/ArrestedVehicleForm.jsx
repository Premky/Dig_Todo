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
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
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
            const result = await axios.get(`${BASE_URL}/display/currentoffice/${exp_office_name}`);
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
            const result = await axios.get(`${BASE_URL}/display/ranks`);
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
            const result = await axios.get(`${BASE_URL}/tango/kashurs`);
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
                reset(); // Clear the form after submission
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
        setValue("date", convertToNepaliDate(data.date)); // Convert and set Nepali date
        setValue("rank_id", data.rank_id); // Convert and set Nepali date
        setValue("name", data.name); // Convert and set Nepali date
        setValue("vehicle_no", data.vehicle_no); // Convert and set Nepali date        
        setValue("kasur_id", data.kasur_id);
        setValue("owner", data.owner);
        setValue("contact", data.contact);
        setValue("voucher", data.voucher);
        setValue("return_date", data.return_date);
        setValue("return_name", data.return_name);
        setValue("return_address", data.return_address);
        setValue("return_contact", data.return_contact);
        setValue("return_remarks", data.return_remarks);
        setValue("remarks", data.remarks);
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
            reset();
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
                        <div className="p-2 justify-content shadow text-center">
                            <u>
                                <h4> पक्राउ सवारी साधन रजिष्टर</h4>
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
                                    <label htmlFor="rank_id">दर्जा<span>*</span></label>

                                    <select {...register('rank_id')} className="form-select" placeholder="Select Rank">
                                        <option value="">दर्जा छान्नुहोस्</option>
                                        {fetchedRank.map((rank) => (
                                            <option key={rank.value} value={rank.value}>
                                                {rank.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.rank_id && <span>{errors.rank_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="name"> नामथर </label>
                                    <input
                                        type='name'
                                        {...register('name', { required: "This field is required." })}
                                        placeholder="प्रहरी कर्मचारीको नामथर"
                                        className="form-control"
                                    />
                                    {errors.name && <span>{errors.name.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="vehicle_no"> सवारी नं. </label>
                                    <input
                                        type='text'
                                        {...register('vehicle_no', { required: "This field is required." })}
                                        placeholder="सवारी नं."
                                        className="form-control"
                                    />
                                    {errors.vehicle_no && <span>{errors.vehicle_no.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="kasur_id">कसुर<span>*</span></label>
                                    <Controller
                                        name="kasur_id"
                                        control={control} // This should come from useForm() hook
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
                                    {errors.kasur_id && <span>{errors.kasur_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="owner"> चालक/धनी </label>
                                    <input
                                        type='text'
                                        {...register('owner', { required: "This field is required." })}
                                        placeholder="चालक/धनी"
                                        className="form-control"
                                    />
                                    {errors.owner && <span>{errors.owner.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="contact"> सम्पर्क नं. </label>
                                    <input
                                        type='number'
                                        {...register('contact', { required: "This field is required." })}
                                        placeholder="सम्पर्क नं."
                                        className="form-control"
                                    />
                                    {errors.contact && <span>{errors.contact.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="voucher"> चिट नं. </label>
                                    <input
                                        type='number'
                                        {...register('voucher', { required: "This field is required." })}
                                        placeholder="चिट नं."
                                        className="form-control"
                                    />
                                    {errors.voucher && <span>{errors.voucher.message}</span>}
                                </div>

                                <div className='bg-warning'>फिर्ता लग्ने भए</div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="return_date">फिर्ता मिति<span>*</span></label>
                                    <Controller
                                        name="return_date"
                                        control={control}

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
                                    {errors.return_date && <span>{errors.return_date.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="return_name"> फिर्ता लग्नेको नामथर </label>
                                    <input
                                        type='text'
                                        {...register('return_name')}
                                        placeholder=""
                                        className="form-control"
                                    />
                                    {errors.return_name && <span>{errors.return_name.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="return_address"> फिर्ता लग्नेको ठेगाना </label>
                                    <input
                                        type='text'
                                        {...register('return_address')}
                                        placeholder=""
                                        className="form-control"
                                    />
                                    {errors.return_address && <span>{errors.return_address.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="return_contact"> फिर्ता लग्नेको सम्पर्क नं. </label>
                                    <input
                                        type='number'
                                        {...register('return_contact')}
                                        placeholder=""
                                        className="form-control"
                                    />
                                    {errors.return_contact && <span>{errors.return_contact.message}</span>}
                                </div>

                                <div className='bg-warning'>केही कैफियत भए</div>
                                <div className="col-xl-3 col-md-4 col-sm-12">
                                    <label htmlFor="remarks">कैफियत</label>
                                    <textarea
                                        {...register('remarks', {
                                            maxLength: { value: 500, message: 'कैफियत ५०० अक्षर भित्र हुनुपर्छ।' }, // Example validation
                                        })}
                                        placeholder="कैफियत लेख्नुहोस्"
                                        className={`form-control ${errors.remarks ? 'is-invalid' : ''}`}
                                    />
                                    {errors.remarks && <span className="text-danger">{errors.remarks.message}</span>}
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