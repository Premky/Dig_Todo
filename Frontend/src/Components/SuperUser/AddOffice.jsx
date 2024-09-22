import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getBaseUrl } from '../../Utilities/getBaseUrl';

const AddOffice = () => {
  const navigate = useNavigate();
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [BASE_URL, setBase_Url] = useState();
  const getBaseURLFunc = async () => {
    const url = await getBaseUrl();
    setBase_Url(url)
  }

  useEffect(() => {
    getBaseURLFunc();
  }, []);

  const [headoffice, setHeadOffice] = useState([]);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [localLevel, setLocalLevel] = useState([]);
  const [offices, setOffices] = useState([]);
  const [officeId, setOfficeId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [office, setOffice] = useState({
    name: '',
    state_id: '',
    district: '',
    city: '',
    email: '',
    contact: '',
    headoffice: '',
    created_by: localStorage.getItem('uid'),
  });

  const clearOffice = () => {
    setOffice({
      name: '',
      state_id: '',
      district: '',
      city: '',
      email: '',
      contact: '',
      headoffice: '',
      created_by: localStorage.getItem('uid'),
    });
    setEditMode(false);
    setOfficeId(null);
  };

  const fetchHeadOffice = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/super/offices`);
      if (result.data.Status) {
        const headoffice_options = result.data.Result.map(ho => ({ value: ho.o_id, label: ho.office_name }));
        setHeadOffice(headoffice_options);
        setOffices(result.data.Result)
        // console.log(offices)
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (BASE_URL) {
      fetchHeadOffice();
      fetchState();
    }
  }, [BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      try {
        const result = await axios.put(`${BASE_URL}/super/update_offices/${officeId}`, office);
        if (result.data.Status) {
          alert("Office Updated Successfully");
          fetchHeadOffice();
          clearOffice();
        } else {
          alert('1', result.data.err);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const result = await axios.post(`${BASE_URL}/super/add_office`, office);
        if (result.data.Status) {
          alert("Office Added Successfully");
          fetchHeadOffice();
          clearOffice();
        } else {
          alert(result.data.Error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = (office) => {
    setOffice({
      // ...office,
      name: office.office_name,
      state_id: office.state_id,
      district: office.district_id,
      city: office.city_id,
      email: office.email,
      contact: office.contact,
      headoffice: office.headoffice,
      created_by: localStorage.getItem('uid'),
    });
    setEditMode(true);
    setOfficeId(office.o_id);


    // Fetch district based on selected state
    fetchDistrict(office.state_id);

    // Fetch local level (city) based on selected district
    fetchLocalLevel(office.district_id);
  };

  const fetchState = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/super/states`);
      if (result.data.Status) {
        const state_options = result.data.Result.map(s => ({ value: s.state_id, label: s.state_name }));
        setState(state_options);
      } else {
        alert('Failed to fetch States');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDistrict = async (state_id) => {
    try {
      const result = await axios.get(`${BASE_URL}/super/districts/${state_id}`);
      if (result.data.Status) {
        const district_options = result.data.Result.map(d => ({ value: d.did, label: d.district_name }));
        setDistrict(district_options);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLocalLevel = async (districtId) => {
    try {
      const result = await axios.get(`${BASE_URL}/super/local_level/${districtId}`);
      if (result.data.Status) {
        const local_level_options = result.data.Result.map(l => ({ value: l.cid, label: l.city_name }));
        setLocalLevel(local_level_options);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeProvince = (selectedOption) => {
    setOffice({ ...office, state_id: selectedOption.value });
    fetchDistrict(selectedOption.value);
  };

  const changeDistrict = (selectedOption) => {
    setOffice({ ...office, district: selectedOption.value });
    fetchLocalLevel(selectedOption.value);
  };

  const changeLocalLevel = (selectedOption) => {
    setOffice({ ...office, city: selectedOption.value });
  };

  const changeHeadoffice = (selectedOption) => {
    setOffice({ ...office, headoffice: selectedOption.value });
  }

  return (
    <>
      <div className="row pl-3 d-flex">
        <div className="col">
          <div className="p-1 d-flex justify-content-center shadow">
            <h4>Add Office</h4>
          </div>
          <div className="col p-1">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="office_name">Office Name</label>
                <input type="text" name='name' placeholder='Enter Office Name'
                  className='form-control rounded-0' value={office.name}
                  onChange={(e) => setOffice({ ...office, name: e.target.value })}
                />
              </div>
              <div className="row mb-3">
                <div className="div">Address:</div>
                <div className="col mb-3">
                  <label htmlFor="province">Province</label>
                  <Select
                    name='province'
                    options={state}
                    value={state.find(option => option.value === office.state_id)}
                    onChange={changeProvince}
                    placeholder="Please Select Province"
                  />
                </div>

                <div className="col mb-3">
                  <label htmlFor="district">District</label>
                  <Select
                    name='district'
                    options={district}
                    value={district.find(option => option.value === office.district)}
                    onChange={changeDistrict}
                    placeholder="Select Province First"
                  />
                </div>

                <div className="col mb-3">
                  <label htmlFor="local_level">City</label>
                  <Select
                    name='city'
                    options={localLevel}
                    value={localLevel.find(option => option.value === office.city)}
                    onChange={changeLocalLevel}
                    placeholder="Select District First"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-8 mb-3">
                  <label htmlFor="email">Email</label>
                  <input type="text" name='email' placeholder='Enter Office Email'
                    className='form-control' rounded-0='true' value={office.email}
                    onChange={(e) => setOffice({ ...office, email: e.target.value })}
                  />
                </div>

                <div className="col mb-3">
                  <label htmlFor="contact_no">Contact No.</label>
                  <input type="number" name='number' placeholder='Enter Contact Number'
                    className='form-control' rounded-0='true' value={office.contact}
                    onChange={(e) => setOffice({ ...office, contact: e.target.value })}
                  />
                </div>
              </div>
              <div className="col mb-3">
                <label htmlFor="headoffice">HeadOffice</label>
                <Select
                  name='headoffice' id='headoffice'
                  options={headoffice}
                  value={headoffice.find(option => option.value === office.headoffice)}
                  onChange={changeHeadoffice}
                  placeholder="तालुक कार्यालय छान्नुहोस्"
                />
                {/* <select name="headoffice" id="headoffice" className='form-select' value={office.headoffice}
                  onChange={(e) => setOffice({ ...office, headoffice: e.target.value })} >
                  {offices.map(o => (
                    <option value={o.oid} key={o.oid}>{o.office_name}, {o.district_name}</option>
                  ))}
                </select> */}
              </div>
              <div className="col mb-3">
                <button type='submit' className='btn btn-success'>
                  {editMode ? 'Update' : 'Add'}
                </button> &nbsp;
                <div className="btn btn-danger" onClick={clearOffice}>
                  Clear
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col">
          <div className="p-1 d-flex justify-content-center shadow">
            <h4>All Office</h4>
          </div>
          <div className="col p-3">
            <table className="table">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>Office Name</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Head Office</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                {offices.map((o, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{o.office_name}</td>
                    <td>{o.city_name}, {o.district_name}</td>
                    <td>{o.email}</td>
                    <th>{o.contact}</th>
                    <th>{o.headoffice_name}</th>
                    <td>
                      <button className='btn btn-sm btn-success' onClick={() => handleEdit(o)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddOffice;