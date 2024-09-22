import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './formstyle.css';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { add } from 'date-fns';
import CreateAddress from '../CreateAddress';
import {getBaseUrl} from '../../Utilities/getBaseUrl'

const AddEmployee = () => {
    const navigate = useNavigate();
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }

    useEffect(() => {
        getBaseURLFunc();
    }, []);
    
    const [editMode, setEditMode] = useState(false);

    const [addEmployee, setAddEmployee] = useState({
        docr_no: '',
        personal_no: '',
        pmis: '',
        symbol_no: '',
        rank: '',
        name_en: '',
        name_np: '',
        dob: null,
        address: '',
        recruit_date: '',
        recruit_rank: '',
        gender: '',
        qualification_id: null,
        contact_no: '',
        deputation: null,
        working: null,
        in_working: null,
        family: null,
        created_by: localStorage.getItem('uid')
    })

    const clearAddEmployee = () => {
        setAddEmployee({
            docr_no: '',
            personal_no: '',
            pmis: '',
            symbol_no: '',
            rank: '',
            name_en: '',
            name_np: '',
            dob: '',
            address: '',
            recruit_date: '',
            recruit_rank: '',
            gender: '',
            qualification_id: null,
            contact_no: '',
            deputation: null,
            working: null,
            in_working: null,
            family: null,
            created_by: localStorage.getItem('uid')
        });
        setEditMode(false);
    }
    const [empAddress, setEmpAddress] = useState({
        state: '',
        district: '',
        city: '',
        ward: '',
        is_permanent: '',
    })

    const [office, setOffice] = useState([]);
    const [officeOption, setOfficeOption] = useState([]);
    const fetchOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/offices`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.o_id,
                    label: opt.office_name
                }));
                setOfficeOption(options);
                setOffice(result.data.Result)
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const [branches, setBranches] = useState([])
    const [branchOption, setBranchOption] = useState([])
    const fetchBranches = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/branches`);
            if (result.data.Status) {
                setBranches(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.bid,
                    label: opt.branch_name
                }));
                setBranchOption(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const [officeBranch, setOfficeBranch] = useState([])
    const [officeBranchOption, setOfficeBranchOption] = useState([])
    const fetchOfficeBranch = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/officebranch`);
            if (result.data.Status) {
                setOfficeBranch(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.bid,
                    label: opt.office_id
                }))
                setOfficeBranchOption();
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const [rank, setRank] = useState([])
    const [rankOption, setRankOption] = useState([])
    const fetchRank = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/ranks`);
            if (result.data.Status) {
                setRank(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.rank_id,
                    label: opt.rank_np
                }))
                setRankOption(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeRank = (selectedOption) => {
        setAddEmployee({ ...addEmployee, rank: selectedOption.value })
    }

    const changeRecruitRank = (selectedOption) => {
        setAddEmployee({ ...addEmployee, recruit_rank: selectedOption.value })
    }


    const handleDobChange = (value) => {
        setAddEmployee({ ...addEmployee, dob: value });
    };
    const handleRecruitDateChange = (value) => {
        setAddEmployee({ ...addEmployee, recruit_date: value });
    };
    const [dobValidationError, setDobValidationError] = useState();
    const [recruitDateValidationError, setRecruitDateValidationError] = useState();

    const [state, setState] = useState([])
    const [stateOption, setStateOption] = useState([])
    const fetchState = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/states`);
            if (result.data.Status) {
                setState(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.state_id,
                    label: opt.state_name
                }))
                setStateOption(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const changeState = (selectedOption) => {
        setEmpAddress({
            ...empAddress,
            state: selectedOption.value
        })
        fetchDistrict(selectedOption.value);
    }


    const [district, setDistrict] = useState([])
    const [districtOption, setDistrictOption] = useState([])
    const fetchDistrict = async (state_id) => {
        try {
            const result = await axios.get(`${BASE_URL}/super/districts/${state_id}`);
            if (result.data.Status) {
                const optionDistrict = result.data.Result.map(d => ({ value: d.did, label: d.district_name }));
                setDistrict(result.data.Result);
                setDistrictOption(optionDistrict);
                // console.log(result)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeDistrict = (selectedOption) => {
        setEmpAddress({ ...empAddress, district: selectedOption.value })
        fetchCity(selectedOption.value)
    }

    const [city, setCity] = useState([])
    const [cityOption, setCityOption] = useState([])
    const fetchCity = async (state_id) => {
        try {
            const result = await axios.get(`${BASE_URL}/super/local_level/${state_id}`);
            if (result.data.Status) {
                const optionCity = result.data.Result.map(d => ({ value: d.cid, label: d.city_name }));
                setCity(result.data.Result);
                setCityOption(optionCity);
                // console.log(result)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeCity = (selectedOption) => {
        setEmpAddress({ ...empAddress, city: selectedOption.value })
    }

    const [ispermanent, setIsPermanent] = useState(false);
    const handleCheckboxChange = (e) => {
        setIsPermanent(e.target.checked)
        setEmpAddress({ ...empAddress, is_permanent: ispermanent })
        // console.log(ispermanent)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            employee: addEmployee,
            address: empAddress
        };

        try {
            const result = await axios.post(`${BASE_URL}/emp/add_employee`, postData);
            if (result.data.Status) {
                alert('Employee added successfully')
                // navigate('')
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.error('Error adding employee', err);
        }
    }

    useEffect(() => {
        fetchOfficeBranch();
        fetchBranches();
        fetchOffice();
        fetchRank();
        fetchState();
        fetchDistrict();
    }, []);

    return (
        <>
            <div className="row pl-2 d-flex">
                <div className="col">
                    <div className="p-1 d-flex justify-content-center shadow">
                        <h4>Add Employee</h4>
                    </div>

                    <div className="p-1">
                        <span>Search</span>
                    </div>

                    <div className="p-1">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor=""> डोसियर नं. </label>
                                    <input type="text" name='docr' placeholder='डोसियर नं.'
                                        className='custom-input'
                                        value={addEmployee.docr_no}
                                        onChange={(e) => setAddEmployee({ ...addEmployee, docr_no: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col mb-3">
                                    <label htmlFor="personal_no">व्यक्तिगत नं.</label>
                                    <input type="personal_no" name='personal_no' placeholder='व्यक्तिगत नं.'
                                        className='custom-input'
                                        value={addEmployee.personal_no}
                                        onChange={(e) => setAddEmployee({ ...addEmployee, personal_no: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col mb-3">
                                    <label htmlFor="pmis">कम्प्युटर कोड</label>
                                    <input type="number" name='pmis' placeholder='PMIS(कम्प्युटर कोड)'
                                        className='custom-input'
                                        value={addEmployee.pmis}
                                        onChange={(e) => setAddEmployee({ ...addEmployee, pmis: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col mb-3">
                                    <label htmlFor="symbol_no">संकेत नं.</label>
                                    <input type="symbol_no" name='symbol_no' placeholder='संकेत नं.'
                                        className='custom-input'
                                        value={addEmployee.symbol_no}
                                        onChange={(e) => setAddEmployee({ ...addEmployee, symbol_no: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="rank">दर्जा</label>
                                    <Select
                                        name='rank' id='offirankce'
                                        className='custom-input'
                                        options={rankOption}
                                        value={rankOption.find(
                                            option => option.value === rankOption.rank_id
                                        )}
                                        onChange={changeRank}
                                        placeholder='दर्जा'
                                        required
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="name_en">Name (IN ENGLISH)</label>
                                    <input type="name_en" name='name_en' placeholder='Name'
                                        className='custom-input'
                                        value={addEmployee.name_en}
                                        onChange={(e) => setAddEmployee({ ...addEmployee, name_en: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col mb-3">
                                    <label htmlFor="name_np">नाम (नेपालीमा)</label>
                                    <input type="name_np" name='name_np' placeholder='नाम (नेपालीमा)'
                                        className='custom-input'
                                        value={addEmployee.name_np}
                                        onChange={(e) => setAddEmployee({ ...addEmployee, name_np: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col mb-3">
                                    <label htmlFor="dob">जन्म मिति</label>

                                    <NepaliDatePicker
                                        value={addEmployee.dob}
                                        className='custom-input'
                                        required
                                        onChange={handleDobChange}
                                        options={{
                                            calenderLocale: 'ne',
                                            valueLocale: 'en',
                                        }}
                                    />
                                    {dobValidationError && <div className='text-danger'>{dobValidationError}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="font-weight-bold">
                                    ठेगानाः
                                </div>
                                <div className="col-3 mb-3">
                                    <label htmlFor="state">प्रदेश</label>
                                    <Select
                                        name='state' id='state'
                                        className='custom-input'
                                        options={stateOption}
                                        value={stateOption.find(
                                            option => option.value === stateOption.state_id
                                        )}
                                        onChange={changeState}
                                        placeholder='प्रदेश'
                                        required
                                    />
                                </div>
                                <div className="col-3 mb-3">
                                    <label htmlFor="district">जिल्ला</label>
                                    <Select
                                        name='district' id='district'
                                        className='custom-input'
                                        options={districtOption}
                                        value={districtOption.find(
                                            option => option.value === districtOption.state_id
                                        )}
                                        onChange={changeDistrict}
                                        placeholder='जिल्ला'
                                        required
                                    />
                                </div>

                                <div className="col-3 mb-3">
                                    <label htmlFor="city">न.पा./गा.पा.</label>
                                    <Select
                                        name='city' id='city'
                                        className='custom-input'
                                        options={cityOption}
                                        value={cityOption.find(
                                            option => option.value === cityOption.state_id
                                        )}
                                        onChange={changeCity}
                                        placeholder='न.पा./गा.पा.'
                                        required
                                    />
                                </div>
                                <div className="col-1 mb-3 pt-2">
                                    <label htmlFor="ward">वडा नं.</label>
                                    <input type="number" name='ward' placeholder='वडा नं.'
                                        className='custom-input' style={{ width: '55px' }}
                                        value={empAddress.ward}
                                        onChange={(e) => setEmpAddress({ ...empAddress, ward: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-1 mb-3 pt-2">
                                    <label htmlFor='is_permanent'>
                                        <input
                                            type="checkbox"
                                            checked={ispermanent}
                                            onChange={handleCheckboxChange}
                                        /> &nbsp;
                                        स्थायी ठेगाना हो/होइन {ispermanent} (?)
                                    </label>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="recruit_date">जन्म मिति</label>

                                    <NepaliDatePicker
                                        value={addEmployee.dob}
                                        className='custom-input'
                                        required
                                        onChange={handleRecruitDateChange}
                                        options={{
                                            calenderLocale: 'ne',
                                            valueLocale: 'en',
                                        }}
                                    />
                                    {recruitDateValidationError && <div className='text-danger'>{recruitDateValidationError}</div>}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="recruitrank">भर्ना दर्जा</label>
                                    <Select
                                        name='recruitrank' id='racruitrank'
                                        className='custom-input'
                                        options={rankOption}
                                        value={rankOption.find(
                                            option => option.value === rankOption.rank_id
                                        )}
                                        onChange={changeRecruitRank}
                                        placeholder='शुरु भर्ना भएको दर्जा'
                                        required
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="gender">लिङ्ग</label>
                                    <select name='gender' className='form-control'
                                        onChange={(e) => setAddEmployee({ ...addEmployee, gender: e.target.value })}
                                    >
                                        <option value="1">पुरुष</option>
                                        <option value="2">महिला</option>
                                        <option value="3">अन्य</option>
                                    </select>
                                </div>
                                <div className="col mb-3 pt-2">
                                    <label htmlFor="ward">सम्पर्क नं.</label>
                                    <input type="number" name='contact' placeholder='सम्पर्क नं.'
                                        className='custom-input'
                                        value={addEmployee.contact_no}
                                        onChange={(e) => setAddEmployee({ ...addEmployee, contact_no: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col mb-3">
                                    <button className='btn btn-success' >Add</button>
                                </div>
                                <div className="col mb-3">
                                    <button className='btn btn-danger' onClick={clearAddEmployee}>Clear</button>
                                </div>
                            </div>

                        </form>
                    </div>


                </div>
                <div className="col-3">
                    <div className="p-1 d-flex justify-content-center shadow">
                        <h4>अन्य आवश्यक</h4>
                    </div>
                    <div>
                        {/* <CreateAddress/> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddEmployee