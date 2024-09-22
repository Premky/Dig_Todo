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

const CurrentOfficerLeave = () => {
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
    
    const [currentOfficerLeave, setCurrentOfficerLeave] = useState([])
    const fetchCurrentOfficerLeave = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/currentofficerleave`);
            if (result.data.Status) {
                const empOptions = result.data.Result;
                console.log(empOptions)
                setCurrentOfficerLeave(empOptions);
            } else {
                alert('Leave Officer', result.data.result);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if(BASE_URL){
        fetchCurrentOfficerLeave();
    }
    }, []
    )

    return (
        <>
            <div className="current-duty-container m-0 p-0 container-fluid">
                <div className="d-flex flex-column px-0 pt-0 " >
                    {currentOfficerLeave.length > 0 &&
                        (<div className="p-2 d-flex justify-content-center bg-primary shadow text-light">
                            कार्यालय प्रमुखहरुको बिदाको अभिलेख
                        </div>)
                    }
                    <table className="table table-sm">
                        <thead>
                            <tr className='text-center table-primary' style={{ fontSize: '0.8rem' }}>
                                <th>सि.नं.</th>
                                <th>दर्जा नामथर</th>
                                <th>दरबन्दी</th>
                                <th>बिदाको किसिम</th>
                                <th>बिदा बसेको मिति</th>
                                <th>हाजिर हुने मिति</th>
                                <th>कै.</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentOfficerLeave.length > 0 ? (
                                currentOfficerLeave.map((leave, index) => (
                                    <tr key={index} className='text-center'>
                                        <td>{index + 1}</td>
                                        <td>{leave.rank_np} {leave.name_np}</td>
                                        <td>{leave.emp_deputation}</td>
                                        <td>{leave.leave_type}</td>
                                        <td>{leave.leave_date}</td>
                                        <td>{leave.leave_end_date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">कार्यालय प्रमुख बिदामा नरहेको</td>
                                </tr>
                            )}
                        </tbody>



                    </table>
                </div>
            </div>
        </>
    )
}

export default CurrentOfficerLeave