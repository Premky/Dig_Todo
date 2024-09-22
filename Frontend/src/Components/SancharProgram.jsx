import React, { useEffect, useState } from 'react'
import Header from './Headers/Header'
import Footer from './Headers/Footer'
import { useNavigate } from 'react-router-dom'
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"
import { format } from 'date-fns';
import axios from 'axios'
import AllPrograms from './AllPrograms'
import NepaliDate from 'nepali-datetime'

import rightarrow from '../assets/arrow-right.svg'
import { Link } from 'react-bootstrap-icons'
import { getBaseUrl } from '../Utilities/getBaseUrl'

//*******************This is for Modal */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//*******************This is closing for Modal */

const SancharProgram = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }

    useEffect(() => {
        getBaseURLFunc();
    }, []);
    const navigate = useNavigate()

    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');

    const [validationError, setValidationError] = useState();

    const [programs, setPrograms] = useState({
        date: formattedDateNp,
        time: '',
        program: '',
        venue: '',
        organizer: '',
        remarks: '',
        user: localStorage.getItem('uid'),
        office: localStorage.getItem('oid'),
        branch: localStorage.getItem('bid')
    });

    const [programList, setProgramList] = useState([]);
    const [usertype, setUsertype] = useState('');
    const usr_branch_id = localStorage.getItem('bid');
    const [editMode, setEditMode] = useState(false);
    const [editProgramId, setEditProgramId] = useState(null);

    const handleProgramDateChange = (value) => {
        setPrograms({ ...programs, date: value });
    };

    const handleProgramSubmit = async (e) => {
        e.preventDefault()
        if (!programs.date) {
            setValidationError('Date is required');
            return;
        }
        setValidationError('');

        // This method is for add program.
        // axios
        //     .post(`${BASE_URL}/auth/add_program`, programs)
        //     .then(result => {
        //         navigate('/sanchar')
        //         handleClear();
        //         fetch_programs();
        //     })
        //     .catch(err => console.log(err))

        if (editMode) {
            
            try {
                const result = await axios.put(`${BASE_URL}/auth/update_program/${editProgramId}`, programs);
                if (result.data.Status) {
                    handleClear();
                    fetch_programs();
                } else {
                    alert(result.data.Error);
                    console.log(result.data.Error);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const result = await axios.post(`${BASE_URL}/auth/add_programs`, programs);
                if (result.data.Status) {
                    alert("Program Added Successfully");
                    fetch_programs();
                    handleClear();
                } else {
                    alert(result.data.Error);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    const handleEdit = (p) => {
        setPrograms({
            date: p.date,
            time: p.time,
            program: p.program,
            venue: p.venue,
            organizer: p.organizer,
            remarks: p.remarks,
            user: localStorage.getItem('uid'),
            office: localStorage.getItem('oid'),
            branch: localStorage.getItem('bid')
        })
        setEditMode(true);
        setEditProgramId(p.pid);
    }

    const handleClear = () => {
        setPrograms({
            date: formattedDateNp, time: '', program: '', venue: '', organizer: '', remarks: '',
            user: localStorage.getItem('uid'),
            office: localStorage.getItem('oid'),
            branch: localStorage.getItem('bid')
        })
        setEditMode(false);
    }

    useEffect(() => {
        const storedUsertype = localStorage.getItem('type');
        if (storedUsertype) {
            setUsertype(storedUsertype);
        }
    }, []);

    const fetch_programs = () => {
        axios.get(`${BASE_URL}/auth/programs/${localStorage.getItem('oid')}`)
            .then(result => {
                if (result.data.Status) {
                    setProgramList(result.data.Result);
                } else {
                    alert(result.data.Result);
                }
            }).catch(err => console.log(err));
    }

    useEffect(() => {
        if (BASE_URL) {
            fetch_programs();
        }
    }, [BASE_URL]);


    const handleHideShow = async (id, hide) => {
        const action = hide ? 'hide_programs' : 'show_programs';  // Use the appropriate endpoint based on the action
        axios.put(`${BASE_URL}/auth/hide_programs/` + id)
            .then(result => {
                if (result.data.Status) {
                    // Update the specific program in the state without reloading
                    setProgramList(prevPrograms =>
                        prevPrograms.map(program =>
                            program.pid === id ? { ...program, hidden: hide } : program
                        )
                    );
                    fetch_programs();
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));

    };




    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const handleNews = () => {
        navigate('/news')
    }

    const handleDelete = (id) => {

        axios.delete(`${BASE_URL}/auth/delete_programs/` + id)
            .then(result => {
                if (result.data.Status) {

                    fetch_programs();
                    // window.location.reload();
                } else {
                    alert(result.data.Error);
                }
            });
        setOpen(false);
    };

    
    //*******************This is for Modal **************/
    const [open, setOpen] = React.useState(false);
    const [delProgram, setDelProgram] = useState();
    const handleClickOpen = (id) => {
        axios.get(`${BASE_URL}/auth/fetch_delete_program/${id}`)
            .then(result => {
                if (result.data.Status) {
                    console.log(result.data.Result[0].pid)
                    setDelProgram(result.data.Result[0].pid)
                } else {
                    alert(result.data.Error);
                }
            });

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    //*********************This is closing for Modal ***********/

    return (
        <>
            <Header />
            <div className="container-fluid" >
                <div className="row flex-nowrap">
                    {/* <div className="col p-0 m-0"> */}
                    {/* <div className="col-auto col-md-6 col-xl-6 px-sm-6 px-o "> */}
                    <div className="col-auto  px-o ">
                        <div className="pt-2 pb-0 d-flex justify-content-center shadow row">
                            <div className="col"></div>
                            <div className="col"><h4>आजको कार्यक्रम अपडेट गर्नुहोस्</h4> </div>
                            <div className="col"><p className='mb-2 btn btn-success' onClick={handleNews}>News</p></div>
                            
                        </div>
                        <div className="d-flex flex-column px-0 pt-0 min-vh-100">
                            <form className='row g-10 m-2' onSubmit={handleProgramSubmit}>
                                <div className="row">
                                    <div className="col-6">
                                        <label htmlFor="inputDate" className='form-label'>
                                            Date(मिति):
                                        </label>
                                        <NepaliDatePicker
                                            inputClassName="form-control rounded-0"
                                            value={programs.date}
                                            required
                                            onChange={handleProgramDateChange}
                                            options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                        />
                                        {validationError && <div className='text-danger'>{validationError}</div>}
                                    </div>

                                    <div className="col-6">
                                        <label htmlFor="inputDate" className='form-label'>
                                            Time(समय):
                                        </label>
                                        <input type="time" className='form-control rounded-0'
                                            id='inputDate'
                                            onChange={(e) => setPrograms({ ...programs, time: e.target.value })} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="inputDate" className='form-label'>
                                        Program(कार्यक्रम):
                                    </label>
                                    <textarea type="text" className='form-control rounded-0'
                                        id='inputDate' value={programs.program}
                                        onChange={(e) => setPrograms({ ...programs, program: e.target.value })}> </textarea>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="inputDate" className='form-label'>
                                        Venue(स्थान):
                                    </label>
                                    <input type="text" className='form-control rounded-0'
                                        id='inputDate' value={programs.venue}
                                        onChange={(e) => setPrograms({ ...programs, venue: e.target.value })} />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="inputDate" className='form-label'>
                                        Organizer(आयोजक):
                                    </label>
                                    <input type="text" className='form-control rounded-0'
                                        id='inputDate' value={programs.organizer}
                                        onChange={(e) => setPrograms({ ...programs, organizer: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="inputDate" className='form-label'>
                                        Remarks(कैफियत):
                                    </label>
                                    <textarea type="text" className='form-control rounded-0'
                                        id='inputDate' value={programs.remarks}
                                        onChange={(e) => setPrograms({ ...programs, remarks: e.target.value })}>
                                    </textarea>
                                </div>
                                <div className="row">
                                    <div className="col-6 mt-2">
                                        
                                        <button className="btn btn-primary w-100" >
                                            {editMode ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                    <div className="col-6 mt-2">
                                    <div className="btn btn-secondary w-100" onClick={handleClear}>
                                            clear
                                        </div>
                                    </div>
                                </div>
                            </form>
                        
                        <div className="pt-2 d-flex justify-content-center shadow">
                            <h4>सबै कार्यक्रमहरुः</h4>
                        </div>
                        <div className="d-flex flex-column px-0 pt-0">
                            <table className='table table-striped p-0'>
                                <thead className="bg-primary">
                                    <tr>
                                        <th className='bg-primary bg-gradient text-white'> सि.नं.</th>
                                        <th className='bg-primary bg-gradient text-white'>मिति/समय</th>
                                        <th className='bg-primary bg-gradient text-white'>कार्यक्रम</th>
                                        <th className='bg-primary bg-gradient text-white'>स्थान</th>
                                        <th className='bg-primary bg-gradient text-white'>आयोजक</th>
                                        <th className='bg-primary bg-gradient text-white'>कै.</th>
                                        <th className='bg-primary bg-gradient text-white'>सञ्चोधन</th> {/* New column for Edit button */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {programList.map((pl, index) => (
                                        <tr key={index}>
                                            <td style={{ color: 'purple' }}>{index + 1}</td>
                                            <td>
                                                {pl.date}<br />
                                                {pl.time && formatTime(pl.time)}
                                            </td>
                                            <td>{pl.program}</td>
                                            <td>{pl.venue}</td>
                                            <td>{pl.organizer}</td>
                                            <td>{pl.remarks}</td>
                                            {pl.branch_id == usr_branch_id && (
                                                <td>
                                                    {/* {!pl.hidden ? ( */}
                                                    {!pl.is_displayed ? (
                                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleHideShow(pl.pid, true)}>
                                                            <i class="bi bi-eye-slash"></i>
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-info btn-sm me-2" onClick={() => handleHideShow(pl.pid, false)}>
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                    )}

                                                    <button className="btn btn-danger btn-sm me-2" id={pl.pid} onClick={() => handleEdit(pl)}  >
                                                        <i class="bi bi-pencil-square"></i>
                                                    </button>

                                                    <Button className="btn btn-danger btn-sm me-2" id={pl.pid} variant="outlined" onClick={() => handleClickOpen(pl.pid)}>
                                                        <i class="bi bi-trash"></i>
                                                    </Button>

                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>

                    {/* <div className="col-auto col-md-6 col-xl-6  px-o p-0 m-0">                     */}
                        {/* <p className='m-0 mt-1 p-1 btn btn-success' onClick={handleNews}>News</p> */}


                        {/* <AllPrograms /> */}
                        
                    {/* </div> */}
                </div>
            </div>
            <Footer />


            {/* ***************** For Modal  *****************/}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete?"}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleClose}> No </Button>
                    <Button onClick={() => handleDelete(delProgram)} autoFocus> Yes </Button>
                </DialogActions>
            </Dialog>

            {/****************** For Modal  **************** */}
        </>
    )
}

export default SancharProgram