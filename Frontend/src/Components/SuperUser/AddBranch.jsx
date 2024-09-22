import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getBaseUrl } from '../../Utilities/getBaseUrl';

const AddBranch = () => {
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
    const [editOBMode, setEditOBMode] = useState(false);
    //OB=OfficeBranch
    const [obId, setObId] = useState(null);
    const [branchId, setBranchId] = useState(null);
    const [listOfficeBranch, setListOfficeBranch] = useState([])

    const [officeBranch, setOfficeBranch] = useState({
        office_id: '',
        branch_id: '',
        email: '',
        contact: '',
        created_by: localStorage.getItem('uid')
    });

    const clearOfficeBranch = () => {
        setOfficeBranch({
            office_id: '',
            branch_id: '',
            email: '',
            contact: '',
            created_by: localStorage.getItem('uid')
        });
        setEditOBMode(false);
        setObId(null);
    };

    const [branch, setBranch] = useState({
        branch_name: '',
        created_by: localStorage.getItem('uid'),
    });

    const [branches, setBranches] = useState([]);
    const [branchOption, setBranchOption] = useState([]);
    const [officeOption, setOfficeOption] = useState([]);

    const clearBranch = () => {
        setBranch({
            branch_name: '',
            created_by: localStorage.getItem('uid'),
        });
        setEditMode(false);
        setBranchId(null);
    };

    const handleObSubmit = async (e) => {
        e.preventDefault();
        if (BASE_URL) {
            if (editOBMode) {
                try {
                    const result = await axios.put(`${BASE_URL}/super/update_officebranch/${obId}`, officeBranch);
                    if (result.data.Status) {
                        alert("Office Branch Link Updated Successfully");
                        fetchOfficeBranch();
                        clearOfficeBranch();
                    } else {
                        alert(result.data.Error);
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                try {
                    const result = await axios.post(`${BASE_URL}/super/add_officebranch`, officeBranch);
                    if (result.data.Status) {
                        alert("Office Branch Link Added Successfully");
                        fetchOfficeBranch();
                        clearOfficeBranch();
                    } else {
                        alert(result.data.Error);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (BASE_URL) {
            if (editMode) {
                try {
                    const result = await axios.put(`${BASE_URL}/super/update_branches/${branchId}`, branch);
                    if (result.data.Status) {
                        alert("Branch updated successfully");
                        fetchBranches();
                        clearBranch();
                    } else {
                        alert(result.data.Error);
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                try {
                    const result = await axios.post(`${BASE_URL}/super/add_branches`, branch);
                    if (result.data.Status) {
                        alert("Branch added successfully");
                        fetchBranches();
                        clearBranch();
                    } else {
                        alert(result.data.Error);
                        console.log(result.data.err)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    const handleEdit = (b) => {
        setBranch({
            branch_name: b.branch_name,
            created_by: localStorage.getItem('uid'),
        });
        setEditMode(true);
        setBranchId(b.bid);
    };

    const handleobEdit = (ob) => {
        setOfficeBranch({
            office_id: ob.office_id,
            branch_id: ob.branch_id,
            email: ob.branch_email,
            contact: ob.branch_contact,
            created_by: localStorage.getItem('uid')
        });
        setEditOBMode(true);
        setObId(ob.bid)
    }

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

    const fetchOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/offices`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.o_id,
                    label: opt.office_name
                }));
                setOfficeOption(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchOfficeBranch = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/officebranch`);
            if (result.data.Status) {
                setListOfficeBranch(result.data.Result);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if(BASE_URL){
        fetchOfficeBranch();
        fetchBranches();
        fetchOffice();
    }
    }, [BASE_URL]);

    const changeOffice = (selectedOption) => {
        setOfficeBranch({ ...officeBranch, office_id: selectedOption.value });

        const fetchOfficeBranch = async () => {
            try {
                const result = await axios.get(`${BASE_URL}/super/officebranch/${selectedOption.value}`);
                if (result.data.Status) {
                    setListOfficeBranch(result.data.Result);
                } else {
                    alert(result.data.Error);

                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchOfficeBranch();
    };

    const changeBranch = (selectedOption) => {
        setOfficeBranch({ ...officeBranch, branch_id: selectedOption.value });
    };

    return (
        <>
            <div className='row pl-3 d-flex'>
                <div className="col-6">
                    <div className="p-1 d-flex justify-content-center shadow">
                        <h4>Join Office & Branch</h4>
                    </div>
                    <div className="col p-3">
                        <form onSubmit={handleObSubmit}>
                            <div className="col mb-3">
                                <label htmlFor="office">Office</label>
                                <Select
                                    name='office' id='office'
                                    options={officeOption}
                                    value={officeOption.find(
                                        option => option.value === officeBranch.office_id
                                    )}
                                    onChange={changeOffice}
                                    placeholder='Select Office'
                                    required
                                />
                            </div>

                            <div className="col mb-3">
                                <label htmlFor="branch">Branch</label>
                                <Select
                                    name='branch' id='branch'
                                    options={branchOption}
                                    value={branchOption.find(
                                        option => option.value === officeBranch.branch_id
                                    )}
                                    onChange={changeBranch}
                                    placeholder='Select Branch'
                                    required
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-8 mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" name='email' placeholder='Enter Office Email'
                                        className='form-control' value={officeBranch.email}
                                        onChange={(e) => setOfficeBranch({ ...officeBranch, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col mb-3">
                                    <label htmlFor="contact_no">Contact No.</label>
                                    <input type="number" name='number' placeholder='Enter Contact Number'
                                        className='form-control' value={officeBranch.contact}
                                        onChange={(e) => setOfficeBranch({ ...officeBranch, contact: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col mb-3">
                                <button type='submit' className='btn btn-success'>
                                    {editOBMode ? 'Update' : 'Add'}
                                </button> &nbsp;
                                <div className="btn btn-danger" onClick={clearOfficeBranch}>
                                    Clear
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="p-1 d-flex justify-content-center shadow">
                        <h4>Joined Office Branch</h4>
                    </div>
                    <div className="col p-3">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>S.N.</th>
                                    <th>Office</th>
                                    <th>Branch</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listOfficeBranch.map((b, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{b.office_name}</td>
                                        <td>{b.branch_name}</td>
                                        <td>{b.branch_email}</td>
                                        <td>{b.branch_contact}</td>
                                        <td>
                                            <button className='btn btn-sm btn-success' onClick={() => handleobEdit(b)}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col">
                    <div className="p-1 d-flex justify-content-center shadow">
                        <h4>Add/Edit Branch</h4>
                    </div>
                    <div className="col p-3">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="branch">Branch Name</label>
                                <input type="text" name='branch' placeholder='Enter Branch Name'
                                    className='form-control' value={branch.branch_name}
                                    onChange={(e) => setBranch({ ...branch, branch_name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <button type='submit' className='btn btn-success'>
                                    {editMode ? 'Update' : 'Add'}
                                </button> &nbsp;
                                <div className="btn btn-danger" onClick={clearBranch}>
                                    Clear
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="p-1 d-flex justify-content-center shadow">
                        <h4>Existing Branches</h4>
                    </div>
                    <div className="col p-3">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>S.N.</th>
                                    <th>Branch Name</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.map((b, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{b.branch_name}</td>
                                        <td>
                                            <button className='btn btn-sm btn-success' onClick={() => handleEdit(b)}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddBranch;
