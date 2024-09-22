import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import { getBaseUrl } from '../../Utilities/getBaseUrl';

const ShowUsers = () => {
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

    const uid = localStorage.getItem('uid');
    // console.log(uid)

    const [user, setUser] = useState([])
    const [editUser, setEditUser] = useState([])

    useEffect(() => {
        if(BASE_URL){
        fetchUsers();
    }

    }, [{BASE_URL}]);

    const fetchUsers = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/users`);
            if (result.data.Status) {
                // console.log(result.data.Result)
                setUser(result.data.Result);
            } else {
                alert('users',result.data.result);
                console.log(`${BASE_URL}`, 'returned', result.data.result)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = async (id) => {
        // Implement your edit logic here
        console.log(`Editing user with ID: ${id}`);
        try {
            const result = await axios.get(`${BASE_URL}/super/edit_user/`+id);
            if (result.data.Status) {
                // console.log(result.data.EditResult)
                setUser(result.data.EditResult);
            } else {
                alert('usredt',result.data.result);
            }
        } catch (err) {
            console.log(err);
        }
    };


    const handleDelete = async (e) => {
        const id = e.target.id;
        try {
            const result = await axios.delete(`${BASE_URL}/super/delete_user` + id);
            if (result.data.Status) {
                console.log(result.data.Result);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className="px-5 mt-3">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>S.N.</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Usertype</th>
                            <th>Office</th>
                            <th>Branch</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user.map((e, index) => (
                                <tr key={e.id}>
                                    <td>{index + 1}</td>
                                    <td>{e.user_name}</td>
                                    <td>{e.username}</td>
                                    <td>{e.usertype}</td>
                                    <td>{e.office_name}</td>
                                    <td>{e.branch_name}</td>
                                    <td>
                                        {uid == e.Created_by &&
                                            <>                                                
                                                {/* <button className='btn btn-sm btn-success mt-2' id={e.id} onClick={() => handleEdit(e.id)}>Edit</button> */}
                                                <button className='btn btn-sm btn-danger mt-2' id={e.id} onClick={handleDelete}>Del</button>
                                            </>
                                        }
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ShowUsers