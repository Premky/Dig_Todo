import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import getGender from '../../Utilities/getGender';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Icon from '../Utils/Icon';



const Employee = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [currentPmis, setCurrentPmis] = useState([]);
    const [fetchedEmp, setFetchedEmp] = useState([]);
    const [gender, setGender] = useState('');
    const fetchEmployee = async (pmis) => {
        try {
            const result = await axios.get(`${BASE_URL}/display/employee/${pmis}`);
            if (result.data.Status) {
                setFetchedEmp(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchGender = async (genderCode) => {
        const genderValue = await getGender(genderCode);
        setGender(genderValue);
    };

    const handlePmisChange = (e) => {
        setCurrentPmis(e.target.value); // Update state when input changes
    };

    const convertToNepaliDate = (isoDate) => {
        if (!isoDate) {
            return 'null';
        } else {
            const datePart = isoDate.split('T')[0]; // Extract just the date part
            return datePart; // Return in the format needed for the NepaliDatePicker)
        }
    }
        ;

    const clkSearch = () => {
        console.log(currentPmis)
        fetchEmployee(currentPmis);
    }
    return (
        <>
            <div className="row">
                <div className="col pl-2">
                    <input
                        type="text"
                        name="pmis"
                        value={currentPmis} // Bind input value to state
                        onChange={handlePmisChange} // Update state on input change
                    />
                    <button onClick={clkSearch}> Search </button>
                </div>


            </div>
            <div className="row p-2 mt-3">
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>PMIS</TableCell>
                                <TableCell>संकेत नं.</TableCell>
                                <TableCell>नामथर</TableCell>
                                <TableCell>जन्म मिति</TableCell>
                                <TableCell>लैंगिक</TableCell>                                
                                <TableCell>जिल्ला</TableCell>
                                <TableCell>Remarks</TableCell>
                                <TableCell>#</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fetchedEmp.map((row) => (
                                <TableRow key={row.edu_id}>
                                    <TableCell>{row.pmis}</TableCell>
                                    <TableCell>{row.symbol_no}</TableCell>
                                    <TableCell>{row.name_np}</TableCell>
                                    <TableCell>{convertToNepaliDate(row.dob)}</TableCell>
                                    <TableCell>{row.gender}</TableCell>                                    
                                    <TableCell>{row.issue_district}</TableCell>
                                    <TableCell>{row.remarks}</TableCell>
                                    <TableCell>
                                        <div className="row">
                                            <div className="col mb-3 btn btn-success" onClick={() => navigate(`/emp/3puste/${row.pmis}`)}>
                                                View
                                            </div>
                                            <div className="col mb-3 btn btn-success" onClick={() => navigate(`/emp/edit_emp_from/${row.pmis}`)}>
                                                Edit
                                            </div>
                                            <div className="col">
                                            </div>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default Employee