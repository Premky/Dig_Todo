import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteConfirmationModal from '../Utils/ConfirmDeleteModal';
import Icon from '../Utils/Icon';

import './formstyle.css'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
const AddEmployee = () => {

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);

    const [editing, setEditing] = useState(false);
    const [currentEmp, setCurrentEmp] = useState(null);
    const [rank, setRank] = useState([]);
    const [rankOption, setRankOption] = useState([]);
    const [bloodGroups, setBloodGroups] = useState([]);

    const [filePreview, setFilePreview] = useState(null);
    const [fetchEmp, setFetchEmp] = useState([]);
    const [stateOption, setStateOption] = useState([]);
    const [districtOption, setDistrictOption] = useState([]);
    const [cityOption, setCityOption] = useState([]);
    const [empAddress, setEmpAddress] = useState({});

    const [selectedDay, setSelectedDay] = useState(null);

    const handleDate = ({ bsDate, adDate }) => {
        setDate({ date: bsDate });
    };
    const errsapnStyle = {
        color: 'red',
        verticalAlign: 'super'
    }
    // Fetching Ranks
    useEffect(() => {
        fetchRank();
        fetchState();
        fetchEmployees();
        fetchBloodGroup();
    }, [BASE_URL]);

    // Fetch employees
    const { pmis } = useParams();

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const result = await axios.get(`${BASE_URL}/display/fetch_emp/${pmis}`);
            if (result.data.Status) {
                setFetchEmp(result.data.Result);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to fetch employees. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRank = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/ranks`);
            if (result.data.Status) {
                setRank(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.rank_id,
                    label: opt.rank_np
                }));
                setRankOption(options);
            } else {
                console.error(result.data.Error);
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    //Fetching Blood Groups
    const fetchBloodGroup = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/blood`);
            if (result.data.Status) {
                // setBlood(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.id,
                    label: opt.bloodgroup
                }));
                setBloodGroups(options);

            } else {
                console.error(result.data.Error);
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };


    // Fetching States
    const fetchState = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/states`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.state_id,
                    label: opt.state_name
                }));
                setStateOption(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Change handlers for state, district, city
    const changeState = (selectedOption) => {
        setEmpAddress({ ...empAddress, state: selectedOption.value });
        fetchDistrict(selectedOption.value);
    };

    const fetchDistrict = async (state_id) => {
        console.log(state_id)
        try {
            const result = await axios.get(`${BASE_URL}/super/districts/${state_id}`);
            if (result.data.Status) {
                const optionDistrict = result.data.Result.map(d => ({ value: d.did, label: d.district_name }));
                setDistrictOption(optionDistrict);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeDistrict = (selectedOption) => {
        setEmpAddress({ ...empAddress, district: selectedOption.value });
        fetchCity(selectedOption.value);
    };

    const fetchCity = async (district_id) => {
        try {
            const result = await axios.get(`${BASE_URL}/super/local_level/${district_id}`);
            if (result.data.Status) {
                const optionCity = result.data.Result.map(d => ({ value: d.cid, label: d.city_name }));
                setCityOption(optionCity);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeCity = (selectedOption) => {
        setEmpAddress({ ...empAddress, city: selectedOption.value });
    };

    // Handling file change for preview
    const onFileChange = (e) => {
        const photo = e.target.files[0];
        if (photo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(photo);
        }
    };



    // Handling form submit
    const onFormSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('photo', data.photo[0])

            Object.keys(data).forEach(key => formData.append(key, data[key]));
            if (data.file && data.file.length > 0) {
                formData.append('file', data.file[0]);
            }
            const url = editing ? `${BASE_URL}/emp/update_emp/${currentEmp.pmis}` : `${BASE_URL}/emp/add_emp`;
            const method = editing ? 'PUT' : 'POST';
            const result = await axios({ method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });

            if (result.data.Status) {
                alert(`Employee ${editing ? 'updated' : 'added'} ${result.data.pmis} successfully!`);
                // console.log(result.data.pmis)
                reset();
                setEditing(false);
                setCurrentEmp(null);
                setFilePreview(null);
                fetchEmployees();
                navigate(`/emp/qualification-form/${result.data.pmis}`)
            }
        } catch (err) {
            console.error(err);
            alert('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        reset();
        setEditing(false);
        setCurrentEmp(null);
        setFilePreview(null);
        fetchEmployees();
    }

    const handleEdit = (emp) => {
        setCurrentEmp(emp);
        setEditing(true);
        setValue("docr_no", emp.docr_no);
        setValue("personal_no", emp.personal_no);
        setValue("pmis", emp.pmis);
        setValue("symbol_no", emp.symbol_no);
        setValue("name_en", emp.name_en);
        setValue("name_np", emp.name_np);
        setValue("dob", emp.dob);
        setValue("recruit_date", emp.recruit_date);
        setValue("recruit_rank", emp.recruit_rank);
        setValue("gender", emp.gender);
        setValue("sanchay_kosh", emp.sanchay_kosh);
        setValue("nalakosh", emp.nalakosh);
        setValue("pan", emp.pan);
        setValue("ctz_no", emp.ctz_no);
        setValue("issue_district", emp.issue_district);
        setValue("blood_group", emp.blood_group);
        setValue("height", emp.height);
        setValue("chest", emp.chest);
        setValue("huliya", emp.huliya);
        setValue("warna", emp.warna);
        setValue("photo", emp.photo);
        setValue("family", emp.family);        
        if (emp.file) {
            const fileUrl = `${BASE_URL}/${notice.file}`;
            setFilePreview(fileUrl);
        } else {
            setFilePreview(null);
        }
    }

    const handleDelete = async (id) => {
        try {
            const url = `${BASE_URL}/emp/delete_emp/${id}`;
            const result = await axios.delete(url);
            if (result.data.Status) {
                alert('Employee deleted successfully!');
            } else {
                alert('Failed to delete employee');
                console.error('Failed to delete employee')
            }
        } catch (err) {
            console.error(err);
            alert('An error occured while deleting the employee record.');
        } finally {
            fetchEmployees();
        }
    };

    const handleDateChange = (date) => {
        setSelectedDay(date); // Update local state
        setValue('dob', date); // Update the form state
    };

    const convertToNepaliDate = (isoDate) => {
        if (!isoDate) {
            return 'null';
        } else {
            const datePart = isoDate.split('T')[0]; // Extract just the date part
            return datePart; // Return in the format needed for the NepaliDatePicker)
        }
    }
        ;


    const clearImageUrl = () => {
        setFilePreview(null)
    }



    return (
        <div className="container-fluid p-0">
            <div className="row">
                <div className="col-12">
                    <div className="p-2 pt-0 justify-content shadow text-center">
                        <u>
                            <h4>{editing ? 'Edit Employee' : 'Add Employee'}</h4>
                        </u>
                    </div>
                </div>

                <div className="row p-2 mt-3">
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>डोसियर</TableCell>
                                    <TableCell>कम्प्युटर कोड</TableCell>
                                    <TableCell>दर्जा</TableCell>
                                    <TableCell>नामथर</TableCell>
                                    <TableCell>जन्म मिति</TableCell>
                                    <TableCell>ठेगाना</TableCell>                                    
                                    <TableCell>रक्त समुह</TableCell>                                    
                                    <TableCell>Remarks</TableCell>
                                    <TableCell>#</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fetchEmp.map((row) => (
                                    <TableRow key={row.edu_id}>
                                        <TableCell>{row.docr_no}</TableCell>
                                        <TableCell>{row.pmis}</TableCell>
                                        <TableCell>{row.rank_np}</TableCell>
                                        <TableCell>{row.name_np}</TableCell>
                                        <TableCell>{convertToNepaliDate(row.dob)}</TableCell>                                        
                                        <TableCell>{'address'}</TableCell>
                                        <TableCell>{row.blood_group}</TableCell>
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
                                                        onConfirm={() => handleDelete(row.edu_id)}>
                                                        <b>{row.edu_level}| {row.edu_faculty} | {row.institute}</b>
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

                <div className="col-12">
                    <div className="d-flex flex-column px-3 pt-0">
                        <form className="row mt-1 g-3" >
                            <div className="row">
                                <div className="col">
                                    <div className="row">
                                        <div className="col-xl-4 col-md-6 col-sm-12">
                                            <label htmlFor="docr_no">डोसियर नं.<span style={{ color: 'red' }}>*</span></label>
                                            <input
                                                {...register('docr_no', { required: "This field is required." })}
                                                placeholder="डोसियर नं."
                                                className="form-control"
                                            />
                                            {errors.docr_no && <span style={{ color: 'red' }}>{errors.docr_no.message}</span>}
                                        </div>

                                        <div className="col-xl-4 col-md-6 col-sm-12">
                                            <label htmlFor="pmis">कम्प्युटर कोड(PMIS)<span>*</span></label>
                                            <input
                                                {...register('pmis', { required: "This field is required." })}
                                                placeholder="PMIS"
                                                className="form-control"
                                            />
                                            {errors.pmis && <span style={{ color: 'red' }}>{errors.pmis.message}</span>}
                                        </div>

                                        <div className="col-xl-4 col-md-6 col-sm-12">
                                            <label htmlFor="recruit_rank">भर्ना हुँदाको दर्जा</label>
                                            <select {...register('recruit_rank')} className="form-select" placeholder="Select Rank">
                                                <option value="">दर्जा छान्नुहोस्</option>
                                                {rankOption.map((rank) => (
                                                    <option key={rank.value} value={rank.value}>
                                                        {rank.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.recruit_rank && <span>{errors.recruit_rank.message}</span>}
                                        </div>


                                        <div className="col-xl-4 col-md-6 col-sm-12">
                                            <label htmlFor="name_np">नाम थर(नेपालीमा)<span>*</span></label>
                                            <input
                                                {...register('name_np', { required: "This field is required." })}
                                                placeholder="Name (In Nepali)"
                                                className="form-control"
                                            />
                                            {errors.name_np && <span>{errors.name_np.message}</span>}
                                        </div>
                                        <div className="col-xl-4 col-md-6 col-sm-12">
                                            <label htmlFor="name_en">नाम थर(अंग्रेजीमा)<span>*</span></label>
                                            <input
                                                {...register('name_en', { required: "This field is required." })}
                                                placeholder="Name (In English)"
                                                className="form-control"
                                            />
                                            {errors.name_en && <span>{errors.name_en.message}</span>}
                                        </div>



                                        <div className="col-xl-4 col-md-6 col-sm-12">
                                            <label htmlFor="photo">Upload File</label>
                                            <input type="file" {...register('photo')} className="form-control" onChange={onFileChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="col-xl-3 col-md-6 col-sm-12">
                                        {filePreview &&
                                            <div className='row'>
                                                <div className="col-1">
                                                    <div className='btn-danger btn btn-sm ' onClick={clearImageUrl}> x </div>
                                                </div>
                                                <div className="col-11">
                                                    <img src={filePreview} alt="File Preview" style={{ width: '100%', height: 'auto' }} className="img-thumbnail mt-2" />
                                                </div>
                                            </div>}
                                    </div>
                                </div>

                            </div> {/*Close For First Row div*/}

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="gender">लिंङ्ग</label>
                                <select {...register('gender')} className="form-select" placeholder="Select Rank">
                                    <option value="">Gender</option>
                                    <option key='M' value='M'>    पुरुष  </option>
                                    <option key='F' value='F'>    महिला  </option>
                                    <option key='O' value='O'>    अन्य  </option>
                                </select>
                                {errors.gender && <span>{errors.gender.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="dob">जन्म मिति<span>*</span></label>
                                <Controller
                                    name="dob"
                                    control={control}
                                    rules={{ required: "This field is required" }}

                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <NepaliDatePicker
                                            value={value || ""} // Ensure empty string when no date is selected
                                            onChange={(date) => {
                                                onChange(date); // Update form state
                                                setSelectedDay(date); // Update local state
                                            }}
                                            onBlur={onBlur} // Handle blur
                                            dateFormat="YYYY-MM-DD" // Customize your date format
                                            placeholder="Select Nepali Date"
                                            ref={ref} // Use ref from react-hook-form
                                        />
                                    )}
                                />
                                {errors.dob && <span>{errors.dob.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="recruit_date">भर्ना मिति<span>*</span></label>
                                <Controller
                                    name="recruit_date"
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
                                            ref={ref} // Use ref from react-hook-form
                                        />
                                    )}
                                />
                                {errors.recruit_date && <span>{errors.recruit_date.message}</span>}
                            </div>


                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="symbol_no">संकेत नं.<span>*</span></label>
                                <input
                                    {...register('symbol_no', { required: "This field is required." })}
                                    placeholder="संकेत नं."
                                    className="form-control"
                                />
                                {errors.symbol_no && <span>{errors.symbol_no.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="personal_no">व्यक्तिगत नं.<span>*</span></label>
                                <input
                                    {...register('personal_no', { required: "This field is required." })}
                                    placeholder="व्यक्तिगत नं."
                                    className="form-control"
                                />
                                {errors.personal_no && <span>{errors.personal_no.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="sanchay_kosh">कर्मचारी संचय कोष<span>*</span></label>
                                <input
                                    {...register('sanchay_kosh', { required: "This field is required." })}
                                    placeholder="कर्मचारी संचय कोष"
                                    className="form-control"
                                />
                                {errors.sanchay_kosh && <span>{errors.sanchay_kosh.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="nalakosh">नागरिक लगानी नं.<span>*</span></label>
                                <input
                                    {...register('nalakosh', { required: "This field is required." })}
                                    placeholder="नागरिक लगानी नं."
                                    className="form-control"
                                />
                                {errors.personal_no && <span>{errors.nalakosh.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="pan">प्यान नं.<span>*</span></label>
                                <input
                                    {...register('pan', { required: "This field is required." })}
                                    placeholder="PAN Number"
                                    className="form-control"
                                />
                                {errors.pan && <span>{errors.pan.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="ctz_no">नागरिकता नं.<span>*</span></label>
                                <input
                                    {...register('ctz_no', { required: "This field is required." })}
                                    placeholder="नागरिकता नं."
                                    className="form-control"
                                />
                                {errors.ctz_no && <span>{errors.ctz_no.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="issue_district">नागरिकता जारी जिल्ला<span>*</span></label>
                                <input
                                    {...register('issue_district', { required: "This field is required." })}
                                    placeholder="जारी जिल्ला"
                                    className="form-control"
                                />
                                {errors.issue_district && <span>{errors.issue_district.message}</span>}
                            </div>


                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="blood_group">ब्लड ग्रुप<span style={{ color: 'red' }}>*</span></label>
                                <select
                                    {...register('blood_group', { required: "This field is required." })}
                                    className="form-select"
                                    placeholder="Select blood"
                                >
                                    <option value=''>Select Blood Group</option>
                                    {bloodGroups.map((blood) => (
                                        <option key={blood.value} value={blood.value}>
                                            {blood.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.blood_group && <span>{errors.blood_group.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="height">उचाई<span>*</span></label>
                                <input
                                    {...register('height', { required: "This field is required." })}
                                    placeholder="५'५''"
                                    className="form-control"
                                />
                                {errors.height && <span>{errors.height.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="chest">छाती<span>*</span></label>
                                <input
                                    {...register('chest', { required: "This field is required." })}
                                    placeholder="३४''"
                                    className="form-control"
                                />
                                {errors.chest && <span>{errors.chest.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="huliya">हुलिया<span>*</span></label>
                                <input
                                    {...register('huliya', { required: "This field is required." })}
                                    placeholder="गालामा डिम्पल आदी"
                                    className="form-control"
                                />
                                {errors.huliya && <span>{errors.huliya.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="warna">वर्ण<span>*</span></label>
                                <input
                                    {...register('warna', { required: "This field is required." })}
                                    placeholder="गहुँ गोरो आदी"
                                    className="form-control"
                                />
                                {errors.warna && <span>{errors.warna.message}</span>}
                            </div>

                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="family">पति वा पत्नीको कम्प्युटर कोड</label>
                                <input
                                    {...register('family')}
                                    placeholder="पति वा पत्निको कम्प्युटर कोड"
                                    className="form-control"
                                />
                                {errors.family && <span>{errors.family.message}</span>}
                            </div>


                            <div className="col-12">
                                <button type="submit" className="btn btn-primary" disabled={loading} onClick={handleSubmit(onFormSubmit)} >
                                    {loading ? 'Submitting...' : editing ? 'Update Employee' : 'Add Employee'}
                                </button>
                                <div className="col mb-3">
                                    <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                                </div>
                            </div>
                        </form>

                        <div className="row p-2 mt-3">
                            <ul className="list-group">
                                {fetchEmp.map(emp => (
                                    <li key={emp.emp_id} className="list-group-item">{emp.name_np}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AddEmployee;
