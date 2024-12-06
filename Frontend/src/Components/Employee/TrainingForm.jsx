import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import Select from 'react-select';

import Icon from '../Utils/Icon';
import './formstyle.css'
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteConfirmationModal from '../Utils/ConfirmDeleteModal';

const TrainingForm = () => {
  const { pmis } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const npToday = new NepaliDate();
  const formattedDateNp = npToday.format('YYYY-MM-DD');
  const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [fetchedEmp, setFetchedEmp] = useState([]);

  const [fetchedTraining, setFetchedTraining] = useState([]);
  const [currentTraining, setCurrentTraining] = useState([]);
  const [fetchedTrainingList, setFetchedTrainingList] = useState([]);

  const token = localStorage.getItem("token");

  const fetchEmployee = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/display/employee/${pmis}`, 
                {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
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

  const fetchTrainingList = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/emp/training_list`, 
        {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    });
      if (result.data.Status) {
        const options = result.data.Result.map(opt => ({
          value: opt.id,
          label: opt.name_np
      }));
      // setFetchedOffice(options);
        setFetchedTrainingList(options);
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
      const result = await axios.get(`${BASE_URL}/display/training/${pmis}`, 
        {headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    });
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

  const onFormSubmit = async (data) => {
    setLoading(true);
    try {
      const url = editing
        ? `${BASE_URL}/emp/update_training/${currentTraining.id}`
        : `${BASE_URL}/emp/add_training`;
      const method = editing ? 'PUT' : 'POST';

      // Make API request
      const result = await axios({
        method,
        url,
        data: data,
        headers: { 'Content-Type': 'application/json' }
      });

      if (result.data.Status) {
        alert(`Record ${editing ? 'updated' : 'added'} for PMIS: ${result.data.pmis} successfully!`);
        reset();
        setEditing(false);
        fetchTraining();
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert(err)
      // alert('Failed to submit the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (training_detail) => {
    setCurrentTraining(training_detail);
    setEditing(true);
    setValue("pmis", training_detail.pmis);
    setValue("training", training_detail.training);
    setValue("grade", training_detail.grade);
    setValue("training_center", training_detail.training_center);
    setValue("batch", training_detail.batch);

    // Converting dates to correct Nepali date format
    const startdate = convertToNepaliDate(training_detail.start_date);
    const enddate = convertToNepaliDate(training_detail.end_date);

    // Set the converted dates to the form
    setValue("start_date", startdate); // Use the converted start date
    setValue("end_date", enddate);     // Use the converted end date
    setValue("gpa", training_detail.gpa);
    setValue("remarks", training_detail.remarks);
  };

  const convertToNepaliDate = (isoDate) => {
    const datePart = isoDate.split('T')[0]; // Extract just the date part
    return datePart; // Return in the format needed for the NepaliDatePicker
  };

  const handleDelete = async (id) => {
    try {
      const url = `${BASE_URL}/emp/delete_training/${id}`;
      const result = await axios.delete(url);
      if (result.data.Status) {
        alert('Record deleted successfully.');
      } else {
        alert('Failed to delete record.');
      }
    } catch (err) {
      console.log(err);
      alert('Error occurred while deleting the record.');
    } finally {
      fetchTraining();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    if (loading) {
      setLoading(false);
    } else {
      reset();
      setEditing(false);
    }
  }

  useEffect(() => {
    fetchEmployee();
    fetchTraining();
    fetchTrainingList();
  }, [BASE_URL]);

  return (
    <>
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-12">
            <div className="p-2 justify-content shadow text-center">
              <u>
                <h4>तालिम विवरण</h4>
              </u>
            </div>
          </div>
          <div className="col-12 mt-2">
            {fetchedEmp && fetchedEmp.length > 0 ? (
              <div className="row">
                {fetchedEmp.map(emp => (
                  <div className="col" key={emp.pmis}>
                    {emp.pmis} ,
                    {emp.name_np} ,
                    {emp.symbol_no}
                  </div>
                ))}
              </div>)
              : (<p>PMIS Not Found...</p>)}
          </div>
          <div className="col-12">
            <div className="d-flex flex-column px-3 pt-0">
              <form className='row mt-1 g-3'>

                <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="pmis"> कम्प्युटर कोड (PMIS) </label>
                  <input
                    value={pmis}
                    {...register('pmis', { required: "This field is required." })}
                    placeholder="Computer Code"
                    className="form-control"
                    readOnly
                  />
                  {errors.pmis && <span>{errors.pmis.message}</span>}
                </div>

                {/* <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="training"> तालिमको नाम </label>
                  <input
                    {...register('training', { required: "This field is required." })}
                    placeholder="तालिम"
                    className="form-control"
                  />
                  {errors.training && <span>{errors.training.message}</span>}
                </div> */}

                <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="training_id">तालिमको नाम<span>*</span></label>
                  <Controller
                    name="training_id"
                    control={control} // This should come from useForm() hook
                    rules={{ required: "This field is required" }}
                    defaultValue=""
                    render={({ field: { onChange, value, ref } }) => (
                      <Select
                        inputRef={ref} // Set ref to react-select input
                        className='basic-single'
                        classNamePrefix='select'
                        value={fetchedTrainingList.find(option => option.value === value) || null} // Match selected option
                        onChange={(selectedOption) => {
                          onChange(selectedOption ? selectedOption.value : ""); // Update form value
                        }}
                        isClearable={true} // Correct boolean format
                        isSearchable={true}
                        options={fetchedTrainingList}
                      />
                    )}
                  />
                  {errors.training_id && <span>{errors.training_id.message}</span>}
                </div>

                <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="grade">ग्रेड<span>*</span></label>
                  <select
                    {...register('grade', { required: "This field is required." })}
                    className="form-select"
                    placeholder="Select"
                  >
                    <option value=''>Select</option>
                    <option value='A'>क</option>
                    <option value='B'>ख</option>
                    <option value='C'>ग</option>
                    <option value='D'>घ</option>
                  </select>
                  {errors.grade && <span>{errors.grade.message}</span>}
                </div>

                <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="training_center"> तालिम प्राप्त स्थान </label>
                  <input
                    {...register('training_center', { required: "This field is required." })}
                    placeholder="तालिम प्राप्त स्थान"
                    className="form-control"
                  />
                  {errors.training_center && <span>{errors.training_center.message}</span>}
                </div>

                <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="batch"> समुह </label>
                  <input
                    {...register('batch', { required: "This field is required." })}
                    placeholder="समुह"
                    className="form-control"
                  />
                  {errors.batch && <span>{errors.batch.message}</span>}
                </div>

                <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="start_date">सुरु मिति<span>*</span></label>
                  <Controller
                    name="start_date"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <NepaliDatePicker
                        value={value || ""} // Ensure empty string when no date is selected
                        onChange={(date) => {
                          onChange(date); // Update form state
                        }}
                        onBlur={onBlur} // Handle blur
                        dateFormat="YYYY-MM-DD" // Customize your date format
                        placeholder="Select Nepali Date"
                      // ref={ref} // Use ref from react-hook-form
                      />
                    )}
                  />
                  {errors.start_date && <span>{errors.start_date.message}</span>}
                </div>

                <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="end_date">समाप्त मिति<span>*</span></label>
                  <Controller
                    name="end_date"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <NepaliDatePicker
                        value={value || ""} // Ensure empty string when no date is selected
                        onChange={(date) => {
                          onChange(date); // Update form state
                        }}
                        onBlur={onBlur} // Handle blur
                        dateFormat="YYYY-MM-DD" // Customize your date format
                        placeholder="Select Nepali Date"
                      // ref={ref} // Use ref from react-hook-form
                      />
                    )}
                  />
                  {errors.end_date && <span>{errors.end_date.message}</span>}
                </div>

                <div className="col-xl-3 col-md-4 col-sm-12">
                  <label htmlFor="remarks"> कैफियत </label>
                  <input
                    {...register('remarks', { required: "This field is required." })}
                    placeholder="कैफियत"
                    className="form-control"
                  />
                  {errors.remarks && <span>{errors.remarks.message}</span>}
                </div>

                <div className="col-12 row mt-2">
                  <div className="col-2 mb-3 btn btn-success" onClick={() => navigate(`/emp/qualification-form/${pmis}`)}>
                    Previous
                  </div>
                  <div className="col-4">
                    <button type="submit" className="btn btn-primary" disabled={loading} onClick={handleSubmit(onFormSubmit)} >
                      {loading ? 'Submitting...' : editing ? 'Update & Continue' : 'Save & Continue'}
                    </button>
                  </div>
                  <div className="col-4 mb-3">
                    <button className='btn btn-danger' onClick={handleClear}>Clear</button>
                  </div>

                  <div className="col-2 mb-3 btn btn-success" onClick={() => navigate(`/emp/award-form/${pmis}`)}>
                    Next
                  </div>

                </div>
              </form>

              <div className="row p-2 mt-3">
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>PMIS</TableCell>
                        <TableCell>Training</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Training Center</TableCell>
                        <TableCell>Batch</TableCell>
                        <TableCell>Start Date Year</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell>#</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fetchedTraining.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.pmis}</TableCell>
                          <TableCell>{row.training}</TableCell>
                          <TableCell>{row.grade}</TableCell>
                          <TableCell>{row.training_center}</TableCell>
                          <TableCell>{row.batch}</TableCell>
                          <TableCell>{convertToNepaliDate(row.start_date)}</TableCell>
                          <TableCell>{convertToNepaliDate(row.end_date)}</TableCell>
                          <TableCell>{row.remarks}</TableCell>
                          <TableCell>
                            <div className="row">
                              <div className="col">
                                <button name='edit' className='btn btn-sm bg-primary'
                                  onClick={() => handleEdit(row)}>
                                  <Icon iconName="Pencil" style={{ color: 'white', fontSize: '1em' }} />
                                </button>
                              </div>
                              <div className="col">

                                <DeleteConfirmationModal
                                  title={'Are you sure you want to delete this record?'}
                                  buttonText={<span><Icon iconName="Trash" style={{ color: 'red', fontSize: '1em' }} /></span>}
                                  onConfirm={() => handleDelete(row.id)}>
                                  <b>{row.training}| {row.grade} | {row.training_center}</b>
                                  <p>This action cannot be undone.</p>
                                </DeleteConfirmationModal>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default TrainingForm