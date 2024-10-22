import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import Select from 'react-select';

import getGender from '../../Utilities/getGender';
import Icon from '../Utils/Icon';
import './formstyle.css'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteConfirmationModal from '../Utils/ConfirmDeleteModal';
import { Document, Packer, Table as DocxTable, TableRow as DocxRow, TableCell as DocxCell, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

import exportToWord from './Xport';

const FinalPreview = () => {
    const { pmis } = useParams();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [fetchedEmp, setFetchedEmp] = useState([]);
    

    const [fetchedInChange, setFetchedInChange] = useState([]);
    const [currentInChange, setCurrentInChange] = useState([]);
    const [fetchedOffice, setFetchedOffice] = useState([]);
    const [fetchedQualification, setFetchedQualification] = useState([]);
    const [fetchedTraining, setFetchedTraining] = useState([]);
    const [fetchedAward, setFetchedAward] = useState([]);
    const [fetchedDecoration, setFetchedDecoration] = useState([]);
    const [fetchedPunishment, setFetchedPunishment] = useState([]);
    const [fetchedJd, setFetchedJd] = useState([]);

    const fetchEmployee = async () => {
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

    const [gender, setGender] = useState('');
    const fetchGender = async (genderCode) => {
        const genderValue = await getGender(genderCode);
        setGender(genderValue);
    };

    const fetchChange = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/in_change/${pmis}`);
            if (result.data.Status) {
                setFetchedInChange(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchOffice = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/offices`);
            if (result.data.Status) {
                const options = result.data.Result.map(opt => ({
                    value: opt.o_id,
                    label: opt.office_name
                }));
                setFetchedOffice(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchQualification = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/qualification/${pmis}`);
            if (result.data.Status) {
                setFetchedQualification(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchTraining = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/training/${pmis}`);
            if (result.data.Status) {
                setFetchedTraining(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }


    const fetchAward = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/award/${pmis}`);
            if (result.data.Status) {
                setFetchedAward(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchDecoration = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/decoration/${pmis}`);
            if (result.data.Status) {
                setFetchedDecoration(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchPunishment = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/punishment/${pmis}`);
            if (result.data.Status) {
                setFetchedPunishment(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const fetchJd = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/jd/${pmis}`);
            if (result.data.Status) {
                setFetchedJd(result.data.Result);
            } else {
                alert(result.data.Result);
                console.error(result.data.Result);
            }
        } catch (err) {
            console.error(err);
            alert(err)
        }
    }

    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0]; // Extract just the date part
        return datePart; // Return in the format needed for the NepaliDatePicker
    };

    useEffect(() => {
        fetchEmployee();

        fetchQualification();
        fetchTraining();
        fetchAward();
        fetchDecoration();
        fetchPunishment();
        fetchJd();
        fetchGender();

        fetchChange();
        fetchOffice();

    }, [BASE_URL]);

    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="p-2 justify-content shadow text-center">
                            <u>
                                <h4> तिनपुस्ते विवरण</h4>
                            </u>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="p-2 justify-content ">
                            <u>
                                <h5> प्रहरी कर्मचारीको विवरण:</h5>
                            </u>
                        </div>
                        <div className="row p-2 pt-0">
                            {fetchedEmp && fetchedEmp.length > 0 ? (
                                <div className="row">
                                    {fetchedEmp.flatMap(emp => (
                                        <>
                                            <div className="row">
                                                <div className="col-9 row">
                                                    <div className="col-xl-3 col-md-4 col-sm-6">
                                                        <span className='span'>कम्प्युटर कोडः </span>
                                                        <span className='span_value'>{emp.pmis}</span>
                                                    </div>
                                                    <div className="col-xl-3 col-md-4 col-sm-6">
                                                        <span className='span'>दर्जा नामः </span>
                                                        <span className='span_value'>{emp.recruit_rank} {emp.name_np}</span>
                                                    </div>
                                                    <div className="col-xl-3 col-md-4 col-sm-6">
                                                        <span className='span'>जन्म मितिः </span>
                                                        <span className='span_value'>{emp.dob}</span>
                                                    </div>
                                                    <div className="col-xl-2 col-md-3 col-sm-4">
                                                        <span className='span'>लैंगिकः </span>
                                                        <span className='span_value'>{getGender(emp.gender)}</span>
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <img src={emp.photo} height='100px' width='auto' />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>नागरिकता नं. </span>
                                                    <span className='span_value'>{emp.ctz_no}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>जारी जिल्लाः </span>
                                                    <span className='span_value'>{emp.issue_district}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>संकेत नं. </span>
                                                    <span className='span_value'>{emp.symbol_no}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>संकेत नं. </span>
                                                    <span className='span_value'>{emp.symbol_no}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>भर्ना मितिः </span>
                                                    <span className='span_value'>{emp.recruit_date}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>बढुवा मितिः </span>
                                                    <span className='span_value'>{emp.promotion_date}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>रक्त समुहः </span>
                                                    <span className='span_value'>{emp.blood_group}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>स्थायी लेखा नं. </span>
                                                    <span className='span_value'>{emp.pan}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>कर्मचारी संचय कोषः </span>
                                                    <span className='span_value'>{emp.sanchay_kosh}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>नागरिक लगानी कोषः </span>
                                                    <span className='span_value'>{emp.blood_group}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>उचाईः </span>
                                                    <span className='span_value'>{emp.height}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>छातीः </span>
                                                    <span className='span_value'>{emp.chest}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>हुलीयाः </span>
                                                    <span className='span_value'>{emp.huliya}</span>
                                                </div>
                                                <div className="col-xl-2 col-md-3 col-sm-4">
                                                    <span className='span'>वर्णः </span>
                                                    <span className='span_value'>{emp.warna}</span>
                                                </div>
                                            </div>

                                        </>
                                    ))}
                                </div>
                            )
                                : (<p>PMIS Not Found...</p>)}
                        </div>

                        <div className="p-2 justify-content ">
                            <u>
                                <h5> शैक्षिक योग्यता:</h5>
                            </u>
                        </div>
                        <div className="row p-2 pt-0">
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>सि.नं.</TableCell>
                                            <TableCell>Level</TableCell>
                                            <TableCell>Faculty</TableCell>
                                            <TableCell>Institute</TableCell>
                                            <TableCell>Country</TableCell>
                                            <TableCell>Pass Year</TableCell>
                                            <TableCell>Rank</TableCell>
                                            <TableCell>Percentage/GPA</TableCell>
                                            <TableCell>Remarks</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fetchedQualification.map((row, index) => (
                                            <TableRow key={row.edu_id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.edu_level}</TableCell>
                                                <TableCell>{row.edu_faculty}</TableCell>
                                                <TableCell>{row.institute}</TableCell>
                                                <TableCell>{row.country}</TableCell>
                                                <TableCell>{convertToNepaliDate(row.pass_year)}</TableCell>
                                                <TableCell>{row.edu_rank}</TableCell>
                                                <TableCell>{row.gpa}</TableCell>
                                                <TableCell>{row.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="p-2 justify-content ">
                            <u>
                                <h5> तालिम सम्बन्धी विवरण:</h5>
                            </u>
                        </div>
                        <div className="row p-2 pt-0">
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>सि.नं.</TableCell>
                                            <TableCell>Training</TableCell>
                                            <TableCell>Grade</TableCell>
                                            <TableCell>Training Center</TableCell>
                                            <TableCell>Batch</TableCell>
                                            <TableCell>Start Date Year</TableCell>
                                            <TableCell>End Date</TableCell>
                                            <TableCell>Remarks</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fetchedTraining.map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.training}</TableCell>
                                                <TableCell>{row.grade}</TableCell>
                                                <TableCell>{row.training_center}</TableCell>
                                                <TableCell>{row.batch}</TableCell>
                                                <TableCell>{convertToNepaliDate(row.start_date)}</TableCell>
                                                <TableCell>{convertToNepaliDate(row.end_date)}</TableCell>
                                                <TableCell>{row.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="p-2 justify-content ">
                            <u>
                                <h5> पुरस्कार सम्बन्धी विवरण:</h5>
                            </u>
                        </div>
                        <div className="row p-2 pt-0">
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>सि.नं.</TableCell>
                                            <TableCell>पुरस्कार विवरण</TableCell>
                                            <TableCell>पुरस्कार दिने कार्यालय</TableCell>
                                            <TableCell>प्राप्त मिति</TableCell>
                                            <TableCell>रकम(रु)/ग्रेड</TableCell>
                                            <TableCell>चलानी नं.</TableCell>
                                            <TableCell>Remarks</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fetchedAward.map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.office_name}</TableCell>
                                                <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                <TableCell>{row.prize}</TableCell>
                                                <TableCell>{row.sn}</TableCell>
                                                <TableCell>{row.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="p-2 justify-content ">
                            <u>
                                <h5> विभुषण सम्बन्धी विवरण:</h5>
                            </u>
                        </div>
                        <div className="row p-2 pt-0">
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>सि.नं.</TableCell>
                                            <TableCell>विभुषणको प्रकार</TableCell>
                                            <TableCell>पुरस्कार दिने कार्यालय</TableCell>
                                            <TableCell>प्राप्त मिति</TableCell>
                                            <TableCell>विभुषणको नाम</TableCell>
                                            <TableCell>चलानी नं.</TableCell>
                                            <TableCell>Remarks</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fetchedDecoration.map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.office_name}</TableCell>
                                                <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                <TableCell>{row.prize}</TableCell>
                                                <TableCell>{row.sn}</TableCell>
                                                <TableCell>{row.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="p-2 justify-content ">
                            <u>
                                <h5> सजाय सम्बन्धी विवरण:</h5>
                            </u>
                        </div>
                        <div className="row p-2 pt-0">
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>सि.नं.</TableCell>
                                            <TableCell>कारवाही गर्ने कार्यालय</TableCell>
                                            <TableCell>कारवाही किसिम</TableCell>
                                            <TableCell>चलानी नं.</TableCell>
                                            <TableCell>मिति</TableCell>
                                            <TableCell>Remarks</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fetchedPunishment.map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.office_name}</TableCell>
                                                <TableCell>{row.type}</TableCell>
                                                <TableCell>{row.sn}</TableCell>
                                                <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                <TableCell>{row.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="p-2 justify-content ">
                            <u>
                                <h5> नोकरी विवरण विवरण:</h5>
                            </u>
                        </div>
                        <div className="row p-2 pt-0">
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>सि.नं.</TableCell>
                                            <TableCell>दर्जा</TableCell>
                                            <TableCell>सेवा समुह</TableCell>
                                            <TableCell>क्रियाकलाप</TableCell>
                                            <TableCell>कार्यालय</TableCell>
                                            <TableCell>मिति</TableCell>
                                            <TableCell>कायम भएको दरबन्दी</TableCell>
                                            <TableCell>Remarks</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fetchedJd.map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.rank_np}</TableCell>
                                                <TableCell>{row.group_name}</TableCell>
                                                <TableCell>{row.job_name}</TableCell>
                                                <TableCell>{row.office_name}</TableCell>
                                                <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                <TableCell>{row.deputation}</TableCell>
                                                <TableCell>{row.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="p-2 justify-content ">
                            <u>
                                <h5> आन्तरिक सरुवा सम्बन्धी विवरण:</h5>
                            </u>
                        </div>
                        <div className="row p-2 pt-0">
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>सि.नं.</TableCell>
                                            <TableCell>कार्यालय</TableCell>
                                            <TableCell>मिति</TableCell>
                                            <TableCell>Remarks</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fetchedInChange.map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.office_name}</TableCell>
                                                <TableCell>{convertToNepaliDate(row.date)}</TableCell>
                                                <TableCell>{row.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <p style={{ fontWeight: 'bolder' }}>उतार गर्नेः</p>
                                <p>नाम थरः</p>
                                <p>दर्जाः</p>
                                <p>मितिः</p>
                            </div>
                            <div className="col-6">
                                <p>प्रमाणित गर्नेः</p>
                                <p>नाम थरः</p>
                                <p>दर्जाः</p>
                                <p>मितिः</p>
                            </div>
                        </div>

                        <div className="row p-2">
                            <div className="col-2 m-3  btn btn-success" onClick={() => navigate(`/emp/job-working-form/${pmis}`)}>
                                Previous
                            </div>

                            <div className="col-2 m-3 btn btn-warning" onClick={() => exportToWord(fetchedEmp, fetchedQualification, fetchedTraining, fetchedAward, fetchedDecoration, fetchedPunishment, fetchedJd)}>
                                Export To Word
                            </div>

                            <div className="col-2 m-3  btn btn-success" onClick={() => navigate(`/emp`)}>
                                Add New
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FinalPreview