import React, { useEffect, useState } from 'react';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Headers/Header';
import Footer from '../Headers/Footer';
import { getBaseUrl } from '../../Utilities/getBaseUrl'

const AddDoNotice = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }
    console.log(BASE_URL)

    useEffect(() => {
        getBaseURLFunc();
    }, []);

    const navigate = useNavigate();
    const [validationError, setValidationError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [notice, setNotice] = useState({
        date: '',
        subject: '',
        remarks: '',
        image: '',
        user_id: localStorage.getItem('uid'),
        office_id: localStorage.getItem('oid'),
        branch_id: localStorage.getItem('bid'),
    });

    const handleClear = () => {
        setNotice({
            date: '',
            subject: '',
            remarks: '',
            image: '',
            user_id: localStorage.getItem('uid'),
            office_id: localStorage.getItem('oid'),
            branch_id: localStorage.getItem('bid'),
        });
        setSelectedImage(null);
        setPreviewUrl(null);
        setValidationError(null);
    };

    const handleDateChange = (value) => {
        setNotice((prevNotice) => ({ ...prevNotice, date: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('date', notice.date);
        formData.append('subject', notice.subject);
        formData.append('remarks', notice.remarks);
        formData.append('image', selectedImage);
        formData.append('user_id', notice.user_id);
        formData.append('office_id', notice.office_id);
        formData.append('branch_id', notice.branch_id);

        try {
            const response = await axios.post(`${BASE_URL}/auth/add_do_notice`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.Status) {
                alert('Notice uploaded successfully');
                fetchDoNotices();
                handleClear();
            } else {
                setValidationError(response.data.Error || 'Failed to upload notice');
            }
        } catch (error) {
            console.error('There was an error uploading the notice!', error);
            setValidationError(error.response?.data?.Details || 'There was an error uploading the notice.');
        }
    };

    const [doNotice, setDoNotice] = useState([]);

    const fetchDoNotices = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/auth/uploaded_do_notice`);
            if (result.data.Status) {
                setDoNotice(result.data.Result);
            } else {
                alert(result.data.result);
            }
        } catch (error) {
            console.error('Error fetching notices', error);
        }
    };

    useEffect(() => {
        fetchDoNotices();
    }, [BASE_URL]);

    const handleDelete = async (id) => {
        try {
            const result = await axios.delete(`${BASE_URL}/auth/delete_uploaded_notice/${id}`);
            if (result.data.Status) {
                fetchDoNotices();
            } else {
                alert(result.data.Error);
            }
        } catch (error) {
            console.error('Error deleting notice', error);
        }
    };


    return (
        <>
            <Header />
            <div className="m-2 row">
                <div className="col-6">
                    <div className="p-2 d-flex justify-content-center shadow">
                        <div className="col-10">
                            <h3>सुचनाहरु अपडेट गर्नुहोस्</h3>
                        </div>
                        <div className="col-2">
                            <Link to="/doadmin">
                                <button className="btn btn-sm btn-success">ड्युटीहरु</button>
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleUpload}>
                        <div className="col">
                            <label htmlFor="inputTitle">मितिः</label>
                            <NepaliDatePicker
                                inputClassName="form-control rounded-0"
                                value={notice.date}
                                required
                                onChange={handleDateChange}
                                options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                            />
                            {validationError && (
                                <div className="text-danger">{validationError}</div>
                            )}
                        </div>
                        <div className="col">
                            <label htmlFor="inputSubject">विषय</label>
                            <input
                                type="text"
                                className="form-control rounded-0"
                                id="inputSubject"
                                value={notice.subject}
                                onChange={(e) =>
                                    setNotice((prevNotice) => ({
                                        ...prevNotice,
                                        subject: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="inputRemarks">कैफियत</label>
                            <input
                                type="text"
                                className="form-control rounded-0"
                                id="inputRemarks"
                                value={notice.remarks}
                                placeholder="पाना ४ को पाना १"
                                onChange={(e) =>
                                    setNotice((prevNotice) => ({
                                        ...prevNotice,
                                        remarks: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="inputImage">सुचना स्कान गरी अपलोड गर्नुहोस्</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="image"
                                onChange={handleImageChange}
                            />
                            {previewUrl && (
                                <div>
                                    <h3>Image Preview:</h3>
                                    <img src={previewUrl} alt="Image Preview" style={{ width: '100px' }} />
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">Upload Notice</button>
                        {validationError && <div className="alert alert-danger mt-2">{validationError}</div>}
                    </form>
                </div>
                <div className="col-6">
                    <h3>Uploaded Notices</h3>
                    <ul className="list-group">
                        {doNotice.map((notice) => (
                            <li key={notice.donid} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>{notice.subject}</h5>
                                    <p>{notice.remarks}</p>
                                    {notice.notice_img && (
                                        <div>
                                            <img src={`${BASE_URL}/Uploads/${notice.notice_img}`} alt="Notice" style={{ width: '100px' }} />
                                        </div>
                                    )}
                                </div>
                                <button className="btn btn-danger" onClick={() => handleDelete(notice.donid)}>Delete</button>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
            <Footer />
        </>
    );
};

export default AddDoNotice;
