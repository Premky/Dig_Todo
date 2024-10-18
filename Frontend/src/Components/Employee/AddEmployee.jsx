import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';

import './formstyle.css'
// import { Calendar } from 'react-modern-calendar-datepicker';
// import 'react-modern-calendar-datepicker/lib/DatePicker.css';
// import NepaliDatePicker from 'react-nepali-datepicker';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
const AddEmployee = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);

    const [currentEmp, setCurrentEmp] = useState(null);
    const [editing, setEditing] = useState(false);
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
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fetch employees
    const fetchEmployees = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/employee`);
            if (result.data.Status) {
                setFetchEmp(result.data.Result);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to fetch employees. Please try again.');
        }
    };

    // Handling form submit
    const onFormSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]));
            if (data.file && data.file.length > 0) {
                formData.append('file', data.file[0]);
            }
            const url = editing ? `${BASE_URL}/emp/update_emp/${currentEmp.id}` : `${BASE_URL}/auth/add_emp`;
            const method = editing ? 'PUT' : 'POST';
            const result = await axios({
                method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (result.data.Status) {
                alert(`Employee ${editing ? 'updated' : 'added'} successfully!`);
                reset();
                setEditing(false);
                setCurrentEmp(null);
                setFilePreview(null);
                fetchEmployees();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        reset();
        setEditing(false);
        setCurrentEmp(null);
        setFilePreview(null);
        fetchEmployees();
    }

    const handleEdit = (emp) => {
        setCurrentEmp(emp);
        setEditing(true);
        setValue("pmis", emp.pmis);
        setValue("dob", emp.dob);
        setValue("rank", emp.rank);
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

    const clearImageUrl=()=>{
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

                <div className="col-12">
                    <div className="d-flex flex-column px-3 pt-0">
                        <form className="row mt-1 g-3" onSubmit={handleSubmit(onFormSubmit)}>
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
                                            <label htmlFor="file">Upload File</label>
                                            <input type="file" {...register('file')} className="form-control" onChange={onFileChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="col-xl-3 col-md-6 col-sm-12">
                                        {filePreview && <div>
                                            <img src={filePreview} alt="File Preview" style={{ width: '100px', height: 'auto' }} className="img-thumbnail mt-2" />
                                            <div className='btn-danger btn' onClick={clearImageUrl}> x </div>
                                        </div>}
                                    </div>
                                </div>

                            </div> {/*Close For First Row div*/}

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
                                <label htmlFor="sanket_no">संकेत नं.<span>*</span></label>
                                <input
                                    {...register('sanket_no', { required: "This field is required." })}
                                    placeholder="संकेत नं."
                                    className="form-control"
                                />
                                {errors.sanket_no && <span>{errors.sanket_no.message}</span>}
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
                                <label htmlFor="kasakosh">कर्मचारी संचय कोष<span>*</span></label>
                                <input
                                    {...register('kasakosh', { required: "This field is required." })}
                                    placeholder="कर्मचारी संचय कोष"
                                    className="form-control"
                                />
                                {errors.kasakosh && <span>{errors.kasakosh.message}</span>}
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
                                <label htmlFor="ctz_iss">नागरिकता जारी जिल्ला<span>*</span></label>
                                <input
                                    {...register('ctz_iss', { required: "This field is required." })}
                                    placeholder="जारी जिल्ला"
                                    className="form-control"
                                />
                                {errors.ctz_iss && <span>{errors.ctz_iss.message}</span>}
                            </div>


                            <div className="col-xl-3 col-md-6 col-sm-12">
                                <label htmlFor="blood">ब्लड ग्रुप<span style={{ color: 'red' }}>*</span></label>
                                <select
                                    {...register('blood', { required: "This field is required." })}
                                    className="form-select"
                                    placeholder="Select blood"
                                >
                                    <option>Select Blood Group</option>
                                    {bloodGroups.map((blood) => (
                                        <option key={blood.value} value={blood.value}>
                                            {blood.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.blood && <span>{errors.blood.message}</span>}
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


                            <div className="col-12">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Submitting...' : editing ? 'Update Employee' : 'Add Employee'}
                                </button>
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
