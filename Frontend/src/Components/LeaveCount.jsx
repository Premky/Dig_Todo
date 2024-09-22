import React, { useEffect, useState } from 'react'
import Header from './Headers/Header'
import Footer from './Headers/Footer'
import { useNavigate } from 'react-router-dom'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs'
import "nepali-datepicker-reactjs/dist/index.css"
import { format } from 'date-fns';
import axios from 'axios'
import { getBaseUrl } from '../Utilities/getBaseUrl'

const LeaveCount = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }

    useEffect(() => {
        getBaseURLFunc();
    }, [BASE_URL]);

    const navigate = useNavigate()
    const [validationError, setValidationError] = useState();
    const [leaveCount, setLeaveCount] = useState();
    const [calculatedSum, setCalculatedSum] = useState();

    const fetchLeaveCount = () => {
        axios.get(`${BASE_URL}/auth/leave_count_self`)
            .then(result => {
                if (result.data.Status) {
                    const data = result.data.Result[0]
                    setLeaveCount(data)
                    calculateSum(data)
                } else {
                    console.log(result.data.Result)
                    alert('LC', result.data.Result)
                }
            }).catch(err => console.log(err))
    };

    useEffect(() => {        
        if (BASE_URL) {
            fetchLeaveCount(); //Fetch Initially
        };
        const intervalId = setInterval(fetchLeaveCount, 5000); //Fetch every 5 seconds
        return () => clearInterval(intervalId)
    }, [BASE_URL])

    const calculateSum = (data) => {
        if (!data) return;
        const sum = data.dig + data.ssp + data.sp + data.dsp + data.insp + data.ssi +
            data.si + data.asi + data.shc + data.hc + data.ahc + data.pc + data.poa;
        setCalculatedSum(sum);
    };

    if (!leaveCount) {
        return <div>Loading(LC)...</div>
    }

    return (
        <div className='m-0 p-0' >
            <div className="p-2 d-flex justify-content-center text-center bg-primary shadow">
                <h5 className='text-light'> <strong> बिदामा रहेका प्रहरी कर्माचारीहरुको संख्या</strong></h5>
            </div>
            <div className='container-fluid m-0 p-0 border border-warning'>
                <div className="row mx-0 px-2 bg-success bg-gradient text-white text-center">
                    <div className="col">
                        प्रनामनि <br />
                    </div>
                    <div className="col">
                        प्रवउ
                    </div>
                    <div className="col">
                        प्रउ
                    </div>
                    <div className="col">
                        प्रनाउ
                    </div>
                    <div className="col">
                        प्रनि
                    </div>
                    <div className="col">
                        प्रवनानि
                    </div>
                    <div className="col">
                        प्रनानि
                    </div>
                </div>
                <div className="row mx-0 px-2 text-center">
                    {/* <div className="col">{leaveCount.igp}</div>
                    <div className="col">{leaveCount.aig}</div>  */}
                    <div className="col">{leaveCount.dig}</div>
                    <div className="col">{leaveCount.ssp}</div>
                    <div className="col">{leaveCount.sp}</div>
                    <div className="col">{leaveCount.dsp}</div>
                    <div className="col">{leaveCount.insp}</div>
                    <div className="col">{leaveCount.ssi}</div>
                    <div className="col">{leaveCount.si}</div>
                </div>
                <div className="row mx-0 px-2 bg-success bg-gradient text-white text-center">

                    <div className="col">
                        प्रसनि
                    </div>
                    <div className="col">
                        प्रवह
                    </div>
                    <div className="col">
                        प्रह
                    </div>
                    <div className="col">
                        प्रसह
                    </div>
                    <div className="col">
                        प्रज
                    </div>
                    <div className="col">
                        प्रकास
                    </div>
                    <div className="col">
                        जम्मा
                    </div>
                </div>

                <div className="row mx-0 px-2 text-center">
                    <div className="col">{leaveCount.asi}</div>
                    <div className="col">{leaveCount.shc}</div>
                    <div className="col">{leaveCount.hc}</div>
                    <div className="col">{leaveCount.ahc}</div>
                    <div className="col">{leaveCount.pc}</div>
                    <div className="col">{leaveCount.poa}</div>
                    <div className="col">
                        <h5>    {calculatedSum} </h5>
                    </div>
                    <div className="col"></div>
                </div>


            </div>

        </div>
    )
}

export default LeaveCount