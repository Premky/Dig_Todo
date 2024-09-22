import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import Header from '../Headers/Header';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-bootstrap-icons';
import {getBaseUrl} from '../../Utilities/getBaseUrl'

const OfficerLeave = () => {
    const navigate = useNavigate();
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }

    useEffect(() => {
        getBaseURLFunc();
    }, [BASE_URL]);

    const [validationError, setValidationError] = useState(null);
    const [leaveEmp, setLeaveEmp] = useState({
        leave_date: '',
        emp_id: '',
        pmis: '',
        emp_rank: '',
        emp_office: '',
        is_chief: false,
        leave_type: '',
        leave_days: '',
        leave_end_date: '',
        present_day: '',
        created_by: localStorage.getItem('uid') || '',
        office_id: localStorage.getItem('oid') || '',
        branch_id: localStorage.getItem('bid') || '',
        emp_name: '',
    });

    const [pmis, setPmis] = useState('');
    const [employee, setEmployee] = useState([]);
    const [leaveType, setLeaveTypes] = useState([]);
    const [searchLeave, setSearchLeave] = useState([]);
    const [allLeave, setAllLeave] = useState([]);
    const [offices, setOffices] = useState([]);
    const [branches, setBranches] = useState([]);
    const [empSearchErr, setEmpSearchErr] = useState('');

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Pagination state
    const [currentPageSearchLeave, setCurrentPageSearchLeave] = useState(0);
    const [currentPageAllLeave, setCurrentPageAllLeave] = useState(0);
    const itemsPerPage = 10; // Adjust this as needed

    // Calculate pagination data for searchLeave
    const pageCountSearchLeave = Math.ceil(searchLeave.length / itemsPerPage);
    const offsetSearchLeave = currentPageSearchLeave * itemsPerPage;
    const currentItemsSearchLeave = searchLeave.slice(offsetSearchLeave, offsetSearchLeave + itemsPerPage);

    // Calculate pagination data for allLeave
    const pageCountAllLeave = Math.ceil(allLeave.length / itemsPerPage);
    const offsetAllLeave = currentPageAllLeave * itemsPerPage;
    const currentItemsAllLeave = allLeave.slice(offsetAllLeave, offsetAllLeave + itemsPerPage);

    const clearLeaveEmp = () => {
        setLeaveEmp({
            emp_id: '',
            pmis: '',
            emp_rank: '',
            emp_office: '',
            is_chief: false,
            leave_type: '',
            leave_days: '',
            leave_end_date: '',
            present_day: '',
            created_by: localStorage.getItem('uid') || '',
            office_id: localStorage.getItem('oid') || '',
            branch_id: localStorage.getItem('bid') || '',
            emp_name: '',
        });
        setIsEditing(false);
        setEditId(null);
    };

    const fetchEmployees = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/employees`);
            if (result.data.Status) {
                const empOptions = result.data.Result.map(emp => ({ label: emp.name_np, value: emp.emp_id }));
                setEmployee(empOptions);
            } else {
                alert('employees', result.data.result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const result = await axios.get(`${BASE_URL}/display/leavetypes`);
                if (result.data.Status) {
                    setLeaveTypes(result.data.Result);
                } else {
                    alert('Failed to fetch leave types:', result.data.Result);
                }
            } catch (err) {
                console.log(err);
            }
        };


        const fetchOffices = async () => {
            try {
                const result = await axios.get(`${BASE_URL}/super/offices`);
                if (result.data.Status) {
                    setOffices(result.data.Result);
                } else {
                    alert('office', result.data.result);
                }
            } catch (err) {
                console.log(err);
            }
        };

        const fetchLeaveEmployees = async () => {
            try {
                const result = await axios.get(`${BASE_URL}/auth/all_officer_leave`);
                if (result.data.Status) {
                    setAllLeave(result.data.Result);
                } else {
                    alert('Failed to fetch leave employees:', result.data.Result);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchLeaveTypes();
        fetchOffices();
        fetchEmployees();
        fetchLeaveEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const result = await axios.put(`${BASE_URL}/auth/update_officer_leave/${editId}`, leaveEmp);
                if (result.data.Status) {
                    clearLeaveEmp();
                } else {
                    alert('Failed to update leave:', result.data.Result);
                }
            } else {
                const result = await axios.post(`${BASE_URL}/auth/add_officer_leave`, leaveEmp);
                if (result.data.Status) {
                    clearLeaveEmp();
                } else {
                    alert('Failed to add leave:', result.data.Result);
                }
            }
            navigate('/admin/officeleave');
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.get(`${BASE_URL}/display/search_pmis`, { params: { pmis } });
            if (result.data.Status) {

                const emp_data = result.data.Result[0];
                setEmployee(emp_data);
                setEmpSearchErr('');
                setLeaveEmp((leaveEmp) => ({
                    ...leaveEmp,
                    leave_date: '',
                    emp_id: emp_data.emp_id || '',
                    emp_name: emp_data.name_np || '',
                    pmis: emp_data.pmis || '',
                    emp_rank: emp_data.rank || '',
                    emp_office: emp_data.working || 1,
                    is_chief: false,
                    leave_type: '',
                    leave_days: '',
                    leave_end_date: '',
                    present_day: '',
                    created_by: localStorage.getItem('uid') || '',
                    office_id: localStorage.getItem('oid') || '',
                    branch_id: localStorage.getItem('bid') || '',
                }));
                // console.log(leaveEmp)
                try {
                    const leave_result = await axios.get(`${BASE_URL}/auth/office_leave`, { params: { pmis } });
                    if (leave_result.data.Status) {
                        setSearchLeave(leave_result.data.Result);
                    } else {
                        alert('Failed to fetch leave employees:', leave_result.data.Result);
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                clearLeaveEmp();
                setEmployee([]);
                setEmpSearchErr(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = async (id) => {
        try {
            const result = await axios.get(`${BASE_URL}/auth/get_officer_leave/${id}`);
            if (result.data.Status) {
                const emp_data = result.data.Result;
                setLeaveEmp((leaveEmp) => ({
                    ...leaveEmp,
                    leave_date: emp_data.leave_date || '',
                    emp_id: emp_data.emp_id || '',
                    emp_name: emp_data.name_np || '',
                    pmis: emp_data.pmis || '',
                    emp_rank: emp_data.rank || '',
                    emp_office: emp_data.working || '',
                    is_chief: emp_data.is_chief || false,
                    leave_type: emp_data.leave_type || '',
                    leave_days: emp_data.leave_days || '',
                    leave_end_date: emp_data.leave_end_date || '',
                    present_day: emp_data.present_day || '',
                    created_by: localStorage.getItem('uid') || '',
                    office_id: localStorage.getItem('oid') || '',
                    branch_id: localStorage.getItem('bid') || '',
                }));
                setIsEditing(true);
                setEditId(id);
            } else {
                alert('Failed to fetch leave details:', result.data.Result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handlePageChangeSearchLeave = ({ selected }) => {
        setCurrentPageSearchLeave(selected);
    };

    const handlePageChangeAllLeave = ({ selected }) => {
        setCurrentPageAllLeave(selected);
    };

    return (
        <>
            <Header />
            <div className="row pl-3 d-flex">
                <div className="col">
                    <div className="p-2 d-flex justify-content-center shadow">
                        <div className="col-10">
                            <h3>बिदा संख्या अपडेट गर्नुहोस्</h3>
                        </div>
                        <div className="col-2">
                            <Link to="/admin/addleavecount">
                                <button className="btn btn-sm btn-success">ड्युटीहरु</button>
                            </Link>
                        </div>
                    </div>
                    <div className="col p-1">
                        Search User
                        <form >
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="pmis">PMIS</label>
                                    <input
                                        type="text" id="pmis" name="pmis" placeholder='Enter PMIS'
                                        className='form-control rounded-0' value={pmis}
                                        onChange={(e) => setPmis(e.target.value)}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <button className='btn btn-primary mt-4' onClick={handleSearch}>Search</button>
                                </div>
                            </div>
                        </form>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <div className="mb-3 col">
                                    <label htmlFor="leaveenddays">बिदा मिति</label>
                                    <NepaliDatePicker
                                        inputClassName="form-control rounded-0"
                                        value={leaveEmp.leave_date || ''}
                                        required
                                        onChange={(e) => setLeaveEmp({ ...leaveEmp, leave_date: e })}
                                        options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                    />
                                </div>

                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    placeholder='Enter Name'
                                    className='form-control rounded-0'
                                    value={`${leaveEmp.emp_rank || ''} ${leaveEmp.emp_name || ''}`}
                                    onChange={(e) => setLeaveEmp({ ...leaveEmp, emp_name: e.target.value })}
                                />

                            </div>

                            <div className="mb-3">
                                <label htmlFor="office">कार्यरत कार्यालय</label>
                                <select name="office" id="office" className='form-select' value={leaveEmp.emp_office || ''}
                                    onChange={(e) => setLeaveEmp({ ...leaveEmp, emp_office: e.target.value })} disabled>
                                    {offices.map(o => {
                                        return <option value={o.o_id} key={o.o_id}>{o.office_name}</option>
                                    })}
                                </select>
                            </div>

                            <div className="mb-3">
                                <input type="checkbox" name='chief'
                                    checked={leaveEmp.is_chief || false}
                                    onChange={(e) => setLeaveEmp({ ...leaveEmp, is_chief: e.target.checked })}
                                />&nbsp;
                                <label htmlFor="cheif">कार्यलय प्रमुख &nbsp;</label>
                            </div>
                            <div className="row">
                                <div className="mb-3 col">
                                    <label htmlFor="leavetype">बिदा</label>
                                    <select name="leavetype" id="leavetype" className='form-select' value={leaveEmp.leave_type || 1}
                                        onChange={(e) => setLeaveEmp({ ...leaveEmp, leave_type: e.target.value })} >
                                        {leaveType.map(ut => {
                                            return <option value={ut.lt_id} key={ut.lt_id}>{ut.lt_id} {ut.leave_type} ({ut.leave_days} दिन)</option>
                                        })}
                                    </select>
                                </div>

                                <div className="mb-3 col">
                                    <label htmlFor="leavedays">दिन</label>
                                    <input type="number" name='day' placeholder='Enter days'
                                        className='form-control rounded-0' value={leaveEmp.leave_days || ''}
                                        onChange={(e) => setLeaveEmp({ ...leaveEmp, leave_days: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3 col">
                                    <label htmlFor="leaveenddays">विदा समाप्त मिति</label>
                                    <NepaliDatePicker
                                        inputClassName="form-control rounded-0"
                                        value={leaveEmp.leave_end_date || ''}
                                        required
                                        onChange={(e) => setLeaveEmp({ ...leaveEmp, leave_end_date: e })}
                                        options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                    />
                                    {validationError && (
                                        <div className="text-danger">{validationError}</div>
                                    )}
                                </div>

                            </div>
                            {isEditing ? <div className="mb-3 col">
                                <label htmlFor="leaveenddays">हाजिर मिति</label>
                                <NepaliDatePicker
                                    inputClassName="form-control rounded-0"
                                    value={leaveEmp.present_day || ''}
                                    required
                                    onChange={(e) => setLeaveEmp({ ...leaveEmp, present_day: e })}
                                    options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                />
                            </div> : ''}


                            <div className="mb-3">
                                <button type='submit' className='btn btn-success' >{isEditing ? 'Update' : 'Save'}</button> &nbsp;
                                <div className='btn btn-danger' onClick={clearLeaveEmp}>Clear</div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col">
                    <div className='p-1 d-flex justify-content-center shadow '>
                        <h4>बिदाको विवरण</h4>
                    </div>
                    <div className="col p-1">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>सि.नं.</th>
                                    <th>बिदा मिति</th>
                                    <th>हाजिर हुने मिति</th>
                                    <th>हाजिर भएको मिति</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItemsSearchLeave.map((e, index) => (
                                    <tr key={index}>
                                        <td>{offsetSearchLeave + index + 1}</td>
                                        <td>{e.leave_date}</td>
                                        <td>{e.leave_end_date}</td>
                                        <td>{e.present_day}</td>
                                        <td>
                                            <span className='btn btn-sm btn-success' id={e.l_id}
                                                onClick={() => handleEdit(e.l_id)}
                                            >Edit</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageCount={pageCountSearchLeave}
                            onPageChange={handlePageChangeSearchLeave}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                        />
                    </div>
                </div>

                <div className="row">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>सि.नं.</th>
                                <th>कम्प्युटर कोड(PMIS)</th>
                                <th>दर्जा नामथर</th>
                                <th>कार्यलय प्रमुख(?)</th>
                                <th>बिदा</th>
                                <th>बिदा मिति</th>
                                <th>हाजिर हुने मिति</th>
                                <th>हाजिर भएको मिति</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItemsAllLeave.map((e, index) => (
                                <tr key={index}>
                                    <td>{offsetAllLeave + index + 1}</td>
                                    <td>{e.pmis}</td>
                                    <td>{e.name_np}</td>
                                    <td>{e.is_chief ? 'हो' : 'होइन'}</td>
                                    <td>{e.leaveType}</td>
                                    <td>{e.leave_date}</td>
                                    <td>{e.leave_end_date}</td>
                                    <td>{e.present_day}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={pageCountAllLeave}
                        onPageChange={handlePageChangeAllLeave}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                    />
                </div>
            </div>
        </>
    );
};

export default OfficerLeave;
