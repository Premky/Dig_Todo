import React, { useState, useEffect } from "react"

import axios from "axios"
import { format } from 'date-fns';
import config from "../config";
import { getBaseUrl } from "../Utilities/getBaseUrl";


const AllPrograms = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState('');
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }

    useEffect(() => {
        getBaseURLFunc();
    }, []);

    const [programList, setProgramList] = useState([]);
    const [usertype, setUsertype] = useState('');
    const usr_branch_id = localStorage.getItem('bid')

    useEffect(() => {
        const storedUsertype = localStorage.getItem('type');
        if (storedUsertype) {
            setUsertype(storedUsertype);
        }
    }, []);

    const get_programs=()=>{
        axios.get(`${BASE_URL}/auth/programs/${localStorage.getItem('oid')}`)
        .then(result => {
            if (result.data.Status) {
                setProgramList(result.data.Result)
            } else {
                alert(result.data.Result)
                console.log(result.data.Result)
            }
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        // axios.get(`${config.BASE_URL}/auth/programs`)
        if(BASE_URL){
            get_programs();
        }
    })

    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}/auth/delete_programs/` + id)
            .then(result => {
                if (result.data.Status) {
                    window.location.reload()
                } else {
                    alert(result.data.Error)
                    console.log(result.data.Error)
                }
            })
    }

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    return (
        <>
            <div className="d-flex flex-column px-0 pt-0" >
                <table className='table table-striped'>
                    <thead className="bg-primary">
                        <tr className="" >
                            {/* <tr className="bg-primary" style={{ backgroundColor: 'blue' }}> Inline style for testing */}
                            <th className='bg-primary bg-gradient text-white'> सि.नं.</th>
                            <th className='bg-primary bg-gradient text-white'>मिति</th>
                            <th className='bg-primary bg-gradient text-white'>समय</th>
                            <th className='bg-primary bg-gradient text-white'>कार्यक्रम</th>
                            <th className='bg-primary bg-gradient text-white'>स्थान</th>
                            <th className='bg-primary bg-gradient text-white'>आयोजक</th>
                            <th className='bg-primary bg-gradient text-white'>कैफियत</th>

                            {/* {usertype!=="ChiefDisplay" || usertype!=="dodisplay" &&  */}

                            <th className='bg-primary bg-gradient text-white'>#</th>

                        </tr>
                    </thead>
                    <tbody>

                        {programList.map((pl, index) => (
                            <tr key={index} >
                                <td style={{ color: 'purple' }}>{index + 1}</td>
                                {/* <td>{format(new Date(pl.date), 'yyyy-mm-dd')}</td> */}
                                <td>
                                    {pl.date}
                                </td>
                                <td>{pl.time && formatTime(pl.time)}</td>
                                <td>{pl.program}</td>
                                <td>{pl.venue}</td>
                                <td>{pl.organizer}</td>
                                <td>{pl.remarks}</td>
                                {pl.branch_id == usr_branch_id &&
                                    <td><span className="bg-danger text-white p-1" onClick={(e) => handleDelete(pl.pid)}>
                                        Delete
                                    </span>
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AllPrograms