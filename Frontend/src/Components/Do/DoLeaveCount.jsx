import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs'
import "nepali-datepicker-reactjs/dist/index.css"
import { format } from 'date-fns';
import axios from 'axios'
import {getBaseUrl} from '../../Utilities/getBaseUrl'

const DoLeaveCount = () => {
            // const BASE_URL = import.meta.env.VITE_API_BASE_URL
            const [BASE_URL, setBase_Url]= useState();
            const getBaseURLFunc = async () =>{
                const url = await getBaseUrl();       
                setBase_Url(url) 
            }
                    
            useEffect(()=>{
                getBaseURLFunc();
            },[]);
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
                    alert(result.data.Result)
                }
            }).catch(err => console.log(err))
    };

    useEffect(() => {
        if(BASE_URL){
        fetchLeaveCount(); //Fetch Initially
        }
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

            
                <table className='table table-sm table-striped text-center table-bordered'>
                    <thead>
                    <tr >
                        <th className='bg-primary bg-gradient text-white'>प्रनामनि</th>
                        <th className='bg-primary bg-gradient text-white'>प्रवउ</th>
                        <th className='bg-primary bg-gradient text-white'>प्रउ</th>
                        <th className='bg-primary bg-gradient text-white'>प्रनाउ</th>
                        <th className='bg-primary bg-gradient text-white'>प्रनि</th>
                        <th className='bg-primary bg-gradient text-white'>प्रवनानि</th>
                        <th className='bg-primary bg-gradient text-white'>प्रनानि</th>
                        <th className='bg-primary bg-gradient text-white'>प्रसनि</th>
                        <th className='bg-primary bg-gradient text-white'>प्रवह</th>
                        <th className='bg-primary bg-gradient text-white'>प्रह</th>
                        <th className='bg-primary bg-gradient text-white'>प्रसह</th>
                        <th className='bg-primary bg-gradient text-white'>प्रज</th>
                        <th className='bg-primary bg-gradient text-white'>प्रकास</th>
                        <th className='bg-primary bg-gradient text-white'>जम्मा</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr key={leaveCount.lc_id}>
                        <td>{leaveCount.dig}</td>
                        <td>{leaveCount.ssp}</td>
                        <td>{leaveCount.sp}</td>
                        <td>{leaveCount.dsp}</td>
                        <td>{leaveCount.insp}</td>
                        <td>{leaveCount.ssi}</td>
                        <td>{leaveCount.si}</td>
                        <td>{leaveCount.asi}</td>
                        <td>{leaveCount.shc}</td>
                        <td>{leaveCount.hc}</td>
                        <td>{leaveCount.ahc}</td>
                        <td>{leaveCount.pc}</td>
                        <td>{leaveCount.poa}</td>
                        <td><h6>    {calculatedSum} </h6></td>
                    </tr>
                    </tbody>
                </table>
                                
            </div>
        
    )
}

export default DoLeaveCount