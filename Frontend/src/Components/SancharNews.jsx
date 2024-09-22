import React, { useEffect, useState } from 'react'
import Header from './Headers/Header'
import Footer from './Headers/Footer'
import { useNavigate } from 'react-router-dom'
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"
import { format } from 'date-fns';
import axios from 'axios'
import AllPrograms from './AllPrograms'
import AllNews from './AllNews'
import NepaliDate from 'nepali-datetime'
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
    const [validationError, setValidationError] = useState();
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');

    const [newsList, setNewsList] = useState([]);
    const [news, setNews] = useState({
        date: formattedDateNp, title: '', news: '', user: localStorage.getItem("uid"),
        office_id: localStorage.getItem('oid'), branch_id: localStorage.getItem('bid')
    })

    const clearNews = () => {
        setNews({
            date: formattedDateNp, title: '', news: '',
            user: localStorage.getItem("uid"),
            office_id: localStorage.getItem('oid'),
            branch_id: localStorage.getItem('bid')
        })
    }

    const fetch_news = () => {
        axios.get(`${BASE_URL}/auth/news`)
            .then(result => {
                if (result.data.Status) {
                    setNewsList(result.data.Result)
                } else {
                    alert(result.data.Result)
                    console.log(result.data.Result)
                }
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        if (BASE_URL) {
            fetch_news();
        }
    })
    const [editMode, setEditMode] = useState(false);
    const [editNewsId, setEditNewsId] = useState(null);

    const handlDateChange = (value) => {
        // setNews({...news, date:''})
        setNews({ ...news, date: value });
    };

    const handleNewsSubmit = async (e) => {
        e.preventDefault()

        if (!news.date) {
            setValidationError('Date is required');
            return;
        }
        setValidationError('');

        // console.log('Submitting form data:', news);
        if (editMode) {
            try {
                const result = await axios.put(`${BASE_URL}/auth/update_news/${editNewsId}`, news)
                if (result.data.Status) {
                    fetch_news();
                    handleClear();
                } else {
                    alert(result.data.Error);
                    console.log(result.data.Error);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const result = await axios.post(`${BASE_URL}/auth/add_news`, news);
                if (result.data.Status) {
                    // alert("News Added Successfully");
                    fetch_news();
                    clearNews();
                } else {
                    alert(result.data.Error);
                }
            } catch (err) {
                console.log(err);
            }
        }
        // axios
        //     .post(`${BASE_URL}/auth/add_news`, news)
        //     .then(result => { navigate('/news') })
        //     .catch(err => console.log(err))
    }

    const handleClear = () => {
        setNews({
            date: '', title: '', news: '',
            user: localStorage.getItem("uid"), office_id: localStorage.getItem('oid'), branch_id: localStorage.getItem('bid')
        })
        setEditMode(false)
    }

    const hanldeEdit = (n) => {
        setNews({
            date: n.date, title: n.title, news: n.news,
            user: localStorage.getItem("uid"), office_id: localStorage.getItem('oid'), branch_id: localStorage.getItem('bid')
        })
        setEditMode(true);
        setEditNewsId(n.news_id);
    }

    const handleDelete = (id) => {

        axios.delete(`${BASE_URL}/auth/delete_news/` + id)
            .then(result => {
                if (result.data.Status) {
                    // window.location.reload()
                    fetch_news();
                } else {
                    alert(result.data.Error)
                }
            })
    }

    const handlePrograms = () => {
        navigate('/sanchar')
    }

    // console.log(localStorage.getItem("uid"))

    //*******************This is for Modal **************/
    const [open, setOpen] = React.useState(false);
    const [delNews, setDelNews] = useState();
    const handleClickOpen = (id) => {
        axios.get(`${BASE_URL}/auth/fetch_delete_news/${id}`)
            .then(result => {
                if (result.data.Status) {
                    console.log(result.data.Result[0].news_id)
                    setDelNews(result.data.Result[0].news_id)
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
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    {/* <div className="col p-0 m-0"> */}
                    <div className="col-auto col-md-6 col-xl-6 px-sm-6 px-o ">
                        <div className="p-2 d-flex justify-content-center shadow">
                            <h3>आजको ताजा समाचार अपडेट गर्नुहोस्</h3>
                        </div>
                        <div className="d-flex flex-column px-0 pt-0 min-vh-100">
                            <form className='row g-10 m-2' onSubmit={handleNewsSubmit}>
                                <div className="row">
                                    <div className="col-6">
                                        <label htmlFor="inputDate" className='form-label'>
                                            Date(मिति):
                                        </label>
                                        <NepaliDatePicker
                                            inputClassName="form-control rounded-0"
                                            value={news.date}
                                            required
                                            onChange={handlDateChange}
                                            options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                        />
                                        {validationError && <div className='text-danger'>{validationError}</div>}
                                    </div>

                                    <div className="col-6">
                                        <label htmlFor="inputDate" className='form-label'>
                                            Title(शिर्षक):
                                        </label>
                                        <input type="text" className='form-control rounded-0'
                                            id='inputTitle' value={news.title}
                                            onChange={(e) => setNews({ ...news, title: e.target.value })} />
                                    </div>
                                </div>
                                <div className="col-11">
                                    <label htmlFor="inputNews" className='form-label'>
                                        News(समाचार):
                                    </label>
                                    <textarea type="text" className='form-control rounded-0'
                                        id='inputNews' value={news.news}
                                        onChange={(e) => setNews({ ...news, news: e.target.value })}> </textarea>
                                </div>

                                {/* <div className="col-11" hidden> 
                                    <input type="text" className='form-control rounded-0'
                                        id='inputNews' value={news.user}
                                        /> 
                                </div> */}


                                <div className="row">
                                    <div className="col-5 mt-2">
                                        <button className="btn btn-primary w-100" >
                                            {editMode ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                    <div className="col-5 mt-2">
                                        <div className="btn btn-secondary w-100" onClick={handleClear}>
                                            clear
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-auto col-md-6 col-xl-6  px-o p-0 m-0">
                        <p className='m-0 mt-1 p-1 btn btn-warning' onClick={handlePrograms}>Programs</p>
                        <div className="p-2 d-flex justify-content-center shadow">
                            <h3>सबै समाचारहरुः</h3>
                        </div>

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
                                        newsList.map((n, index) => (
                                            <tr key={n.news_id}>
                                                <td>{index + 1} </td>
                                                <td>{n.date}</td>
                                                <td>{n.title}</td>
                                                <td>{n.news}</td>
                                                <td>
                                                    {/* {!pl.hidden ? ( */}
                                                    <button className="btn btn-danger btn-sm me-2" id={n.pid} onClick={() => hanldeEdit(n)}  >
                                                        <i class="bi bi-pencil-square"></i>
                                                    </button>

                                                    {/* <Button className="btn btn-danger btn-sm me-2" id={n.pid} variant="outlined" onClick={() => handleClickOpen(n.pid)}>
                                                        <i class="bi bi-trash"></i>
                                                    </Button> */}
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.news_id)}>
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

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
                    <Button onClick={() => handleDelete(delNews)} autoFocus> Yes {delNews} </Button>
                </DialogActions>
            </Dialog>

            {/****************** For Modal  **************** */}
            <Footer />
        </>
    )
}

export default SancharProgram