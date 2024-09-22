import axios from 'axios'
import React, { useEffect, useState } from 'react'
// import './Dashboard/scroll-table.css'
import '../Dashboard/scroll-table.css'
import { format } from 'date-fns';
import { getBaseUrl } from '../../Utilities/getBaseUrl'

const DoDuties = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }

    useEffect(() => {
        getBaseURLFunc();
    }, []);

    const [allduty, setAllDuty] = useState([]);
    const [usertype, setUsertype] = useState(localStorage.getItem('type'))
    useEffect(() => {
        if (BASE_URL) {
            axios.get(`${BASE_URL}/auth/doduty`)
                .then(result => {
                    if (result.data.Status) {
                        setAllDuty(result.data.Result)
                    } else {
                        console.error(result.data.Result)
                        alert(result.data.Result)
                    }

                }).catch(err => console.log(err))
        }
    })

    const handleDelete = (id) => {
        console.log("Delete Working")
        axios.delete(`${BASE_URL}/auth/delete_doduty/` + id)
            .then(result => {
                if (result.data.Status) {
                    window.location.reload()
                } else {
                    alert(result.data.Error)
                }
            })
    }
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };
    return (
        <>
            {/* <div className={`table-container ${usertype === "DoDisplay" ? 'scrolling' : ''}`}> */}
            <div className="m-0 p-0">
                <table className='table table-sm'  >
                    <thead>
                        <tr className='text-center table-primary'>
                            <th rowSpan={2}>सि.नं.</th>
                            <th colSpan={2}>देखी</th>
                            <th colSpan={2}>सम्म</th>
                            <th rowSpan={2}>डिउटी</th>
                            <th rowSpan={2}>दर्जा नामथर</th>
                            <th rowSpan={2}>सम्पर्क नं.</th>
                            <th rowSpan={2}>कैफियत</th>
                            <th rowSpan={2}>#</th>
                        </tr>
                        <tr className='text-center table-danger'>
                            <th>मिति</th>
                            <th>समय</th>
                            <th>मिति</th>
                            <th>समय</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            allduty.map((ad, index) => (
                                <tr key={ad.id} className={(index + 1) % 2 === 0 ? 'table-success' : 'table-info'}>
                                    <td>{index + 1} </td>
                                    <td className=''>{ad.start_date}</td>
                                    <td className=''>
                                        {/* {ad.start_time && format(new Date(`1970-01-01T${ad.start_time}Z`), 'HH:mm')} */}
                                        {ad.start_time && formatTime(ad.start_time)}
                                    </td>
                                    <td className=''>{ad.end_date}</td>
                                    <td className=''>
                                        {/* {ad.end_time && format(new Date(`1970-01-01T${ad.end_time}Z`), 'HH:mm')} */}
                                        {ad.end_time && formatTime(ad.end_time)}
                                    </td>
                                    <td>{ad.dutytype === 1 ? 'फि.अ.' : ad.dutytype === 2 ? 'डि.अ.' : 'डि.अ. सहायक'}</td>
                                    <td>{ad.do_name}</td>
                                    <td>{ad.contact}</td>
                                    <td>{ad.remarks}</td>
                                    <td>
                                        {/* <button className="btn btn-success btn-sm" onClick={() => handleDelete(n.news_id)}>
                                                Edit 
                                </button> */}
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ad.doid)}>
                                            Delete
                                        </button>
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

export default DoDuties