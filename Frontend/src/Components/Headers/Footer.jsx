import React, { useEffect, useState } from 'react'
import './style.css'
import axios from 'axios'
import { getBaseUrl } from '../../Utilities/getBaseUrl'

const Footer = () => {
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
    const Fetch_News = () => {
        axios.get(`${BASE_URL}/auth/news`)
            .then(result => {
                if (result.data.Status) {
                    setNews(result.data.Result)
                } else {
                    console.log(result.data.Result)
                    alert(result.data.Result)
                }
            }).catch(err => console.log(err))
    }
    useEffect(() => {
        if (BASE_URL) {
            Fetch_News()
        }
    })
    return (
        <div>
            <footer className="page-footer font-small blue" >

                <div className="newsbar-container mt-3 ">
                    <div className="newsbar-title" >
                        <span>ताजा अपडेट</span>
                    </div>
                    <p className="list newsbar-list">
                        <marquee className=" pt-1">
                            <span className="show">
                                <a className="f2 view" >
                                    {news.map((n) => (
                                        <span style={{ fontSize: 'calc(1vw + 1.30rem)' }} key={n.news_id}>
                                            <i className="bi bi-arrow-right" ></i>
                                            {/* &#xF138; */} &nbsp;
                                            {n.news} &nbsp;</span>
                                    ))}
                                </a>
                            </span>
                        </marquee>

                    </p>

                </div>
            </footer>
        </div>
    )
}

export default Footer