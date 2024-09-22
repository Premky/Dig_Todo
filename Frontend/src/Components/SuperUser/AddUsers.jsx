import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import ShowUsers from './ShowUsers'
import { getBaseUrl } from '../../Utilities/getBaseUrl';

const AddUsers = () => {
    const navigate = useNavigate()
        // const BASE_URL = import.meta.env.VITE_API_BASE_URL
        const [BASE_URL, setBase_Url] = useState();
        const getBaseURLFunc = async () => {
            const url = await getBaseUrl();
            setBase_Url(url)
        }
    
        useEffect(() => {
            getBaseURLFunc();
        }, []);

    const [user, setUser] = useState({
        name: '',
        username: '',
        password: '',
        usertype: '',
        office: '',
        branch: '',
        created_by: localStorage.getItem('uid'),
    })

    const [pmis, setPmis] = useState([])
    const [employee, setEmployee] = useState([])
    const [usertypes, setUserTypes] = useState([])
    const [offices, setOffices] = useState([])
    const [branches, setBranches] = useState([])
    const [empSearchErr, setEmpSearchErr] = useState();

    const clearUser = () => {

        setUser({
            name: '',
            username: '',
            password: '',
            usertype: '',
            office: '',
            branch: '',
            created_by: localStorage.getItem('uid'),
        });
    };

    const fetchEmployees = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/employees`);
            if (result.data.Status) {
                const empOptions=result.data.Result.map(emp=>({label:emp.name_np, value:emp.emp_id}))
                setEmployee(empOptions);
                // setEmployee(result.data.Result);
            } else {
                alert('employees', result.data.result)
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchUserTypes = async () => {
            try {
                const result = await axios.get(`${BASE_URL}/super/usertypes`);
                if (result.data.Status) {
                    setUserTypes(result.data.Result);
                } else {
                    alert('ut', result.data.result);
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
        }

        const fetchBranches = async () => {
            try {
                const result = await axios.get(`${BASE_URL}/super/branches`);
                if (result.data.Status) {
                    //This is for normal select
                    // setBranches(result.data.Result);  

                    //This is for react-select
                    setBranches(result.data.Result.map(b => ({ label: b.branch_name, value: b.bid })));
                } else {
                    alert('branches', result.data.result);
                }

            } catch (err) {
                console.log(err);
            }
        }
        if(BASE_URL){
        fetchUserTypes();
        fetchOffices();
        fetchBranches();
        fetchEmployees();
    }
    }, [BASE_URL])



    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(user)
        try {
            const result = await axios.post(`${BASE_URL}/super/add_user`, user);
            navigate('/super/admin_dashboard/add_user')
        } catch (err) {
            console.log(err);
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            const result = await axios.get(`${BASE_URL}/super/search_pmis`, { params: { pmis } });
            // navigate('/super/admin_dashboard/add_user')
            if (result.data.Status) {
                const emp_data = result.data.Result[0]
                console.log(emp_data)
                setEmployee(emp_data)
                setEmpSearchErr('')
                setUser((user) => ({
                    ...user,
                    name: emp_data.name_np || emp_data.user_name,
                    username: emp_data.pmis || emp_data.username,
                    usertype: emp_data.usertype,
                    office: emp_data.office_id,
                    branch: emp_data.branch_id,
                    created_by: localStorage.getItem('uid'),
                }))
                            } else {
                clearUser();
                setEmployee('')
                setEmpSearchErr(result.data.Error)
                console.log(result.data.Error)

            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className="row pl-3 d-flex">
                <div className="col">
                    <div className='p-1 d-flex justify-content-center shadow '>
                        <h4>Add/Edit Users</h4>
                    </div>
                    <div className="col p-1">
                        Search User
                        <form >
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="pmis">PMIS</label>
                                    <input type="text" name='pmis' placeholder='Search PMIS'
                                        className='form-control' rounded-0='true'
                                        onChange={(e) => setPmis(e.target.value)}
                                    />
                                </div>
                                <div className="col pt-4">
                                    <button className='btn btn-primary'
                                        onClick={handleSearch}
                                    >Search</button>
                                </div>
                                {employee &&
                                    <span>
                                        {employee.name_np} | {employee.contact_no} |{employee.dob}
                                    </span>
                                }
                                {empSearchErr &&
                                    <span className='text-danger'>{empSearchErr}</span>
                                }
                            </div>
                        </form>
                    </div>
                    <div className="col p-1">
                        <form onSubmit={handleSubmit}>
                            
                            <div className="mb-3">
                                <label htmlFor="name">Name</label>
                                <input type="text" name='name' placeholder='Enter Name'
                                className='form-control' rounded-0='true' value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                            />
                                {/* <Select
                                        name="emp_name"
                                        options={employee}
                                        value={employee.find(option => option.value === employee.name_np)}
                                        onChange={(selectedOption) => setUser({ ...user, branch: selectedOption.value })}
                                    /> */}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="username">Username</label>
                                <input type="text" name='username' placeholder='Enter PMIS' required
                                    className='form-control' rounded-0='true' value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    // readOnly
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password">Password</label>
                                <input type="text" name='password' placeholder='Password'
                                    className='form-control' rounded-0='true' value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="usertype">User Type</label>

                                <select name="usertype" id="usertype" className='form-select' value={user.usertype}
                                    onChange={(e) => setUser({ ...user, usertype: e.target.value })} >
                                    {usertypes.map(ut => {
                                        return <option value={ut.utid} key={ut.utid}>{ut.ut_name}</option>
                                    })}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="office">Office</label>

                                <select name="office" id="office" className='form-select' value={user.office}
                                    onChange={(e) => setUser({ ...user, office: e.target.value })} >
                                    {offices.map(o => {
                                        return <option value={o.o_id} key={o.o_id}>{o.office_name}</option>
                                    })}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="branch">Branch</label>
                                
                                    <Select
                                        name="branch"
                                        options={branches}
                                        value={branches.find(option => option.value === user.branch)}
                                        onChange={(selectedOption) => setUser({ ...user, branch: selectedOption.value })}
                                    />
                                


                                {/* <select name="branch" id="branch" className='form-select' value={user.branch}
                                    onChange={(e) => setUser({ ...user, branch: e.target.value })} >
                                    {branches.map(b => {
                                        return <option value={b.bid} key={b.bid}>{b.branch_name}</option>
                                    })}
                                </select> */}
                            </div>

                            <div className="mb-3">
                                <button type='submit' className='btn btn-success' >Save</button> &nbsp;
                                <div className='btn btn-danger' onClick={clearUser}>Clear</div>
                            </div>


                        </form>
                    </div>
                </div>
                <div className="col">
                    <div className='p-1 d-flex justify-content-center shadow '>
                        <h4>Existing Users</h4>
                    </div>
                    <div className="col p-1">
                        <ShowUsers />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUsers