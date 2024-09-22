import React, { useEffect, useState } from 'react'
import './style.css'
import axios from 'axios'


const Footer = () => {
            // const BASE_URL = import.meta.env.VITE_API_BASE_URL
            const [BASE_URL, setBase_Url]= useState();
            const getBaseURLFunc = async () =>{
                const url = await getBaseUrl();       
                setBase_Url(url) 
            }
                    
            useEffect(()=>{
                getBaseURLFunc();
            },[]);
    const [news, setNews] = useState([])
    useEffect(() => {
        axios.get(`${BASE_URL}/auth/news`)
            .then(result => {
                if (result.data.Status) {
                    setNews(result.data.Result)
                } else {
                    alert(result.data.Result)
                    console.log(result.data.Result)
                }
            }).catch(err => console.log(err))
    })
    return (
        
            <footer className="page-footer font-small blue m-0 p-0" >

                <div className="newsbar-container  m-0 p-0 ">
                    <div className="newsbar-title" >
                        <span>ताजा अपडेट</span>
                    </div>
                    <p className="list newsbar-list">
                        <marquee className=" pt-1">
                            <span className="show">                                
                                    <a className="f2 view" >
                                       {news.map((n) => (
                                        <span className='display-5' key={n.news_id}> 
                                        <i className="bi bi-arrow-right text-danger"> * </i> 
                                            
                                        {n.news} &nbsp;</span> 
                                       ))}
                                    </a>
                                

                            </span>
                        </marquee>

                    </p>

                </div>
            </footer>
        
    )
}

export default Footer