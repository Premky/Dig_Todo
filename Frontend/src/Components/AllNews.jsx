import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getBaseUrl } from '../Utilities/getBaseUrl';

const AllNews = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }

    useEffect(() => {
        getBaseURLFunc();
    }, []);
    
    const [news, setNews] = useState([])
    const fetch_news=()=>{
        axios.get(`${BASE_URL}/auth/news`)
            .then(result => {
                if (result.data.Status) {
                    setNews(result.data.Result)
                } else {
                    alert(result.data.Result)
                    console.log(result.data.Result)
                }
            }).catch(err => console.log(err))
    }

    useEffect(() => {
    if(BASE_URL){
        fetch_news();
    }
    })

    const handleDelete = (id) => {

        axios.delete(`${BASE_URL}/auth/delete_news/` + id)
            .then(result => {
                if (result.data.Status) {
                    window.location.reload()
                } else {
                    alert(result.data.Error)
                }
            })
    }


    return (
        <>
            <div className="d-flex flex-column px-0 pt-0 min-vh-100">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>सि.नं.</th>
                            <th>मिति</th>
                            <th>शिर्षक</th>
                            <th>समाचार</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            news.map((n, index) => (
                                <tr key={n.news_id}>
                                    <td>{index + 1} </td>
                                    <td>{n.date}</td>
                                    <td>{n.title}</td>
                                    <td>{n.news}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.news_id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AllNews