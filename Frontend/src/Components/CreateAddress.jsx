import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import reactSelect from 'react-select'
import Select from 'react-select';
import { getBaseUrl } from '../Utilities/getBaseUrl';

const CreateAddress = () => {
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

    const [address, setAddress] = useState({
        state: '',
        district: '',
        city: '',
        ward: '',
        is_permanent: '',
    })

    const clearAddress = () => {
        setAddress({
            state: '',
            district: '',
            city: '',
            ward: '',
            is_permanent: '',
        })
    }
    const [state, setState] = useState([])
    const [stateOption, setStateOption] = useState([])
    const fetchState = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/super/states`);
            if (result.data.Status) {
                setState(result.data.Result);
                const options = result.data.Result.map(opt => ({
                    value: opt.state_id,
                    label: opt.state_name
                }))
                setStateOption(options);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const changeState = (selectedOption) => {
        setAddress({
            ...address,
            state: selectedOption.value
        })
        fetchDistrict(selectedOption.value);
    }


    const [district, setDistrict] = useState([])
    const [districtOption, setDistrictOption] = useState([])
    const fetchDistrict = async (state_id) => {
        try {
            const result = await axios.get(`${BASE_URL}/super/districts/${state_id}`);
            if (result.data.Status) {
                const optionDistrict = result.data.Result.map(d => ({ value: d.did, label: d.district_name }));
                setDistrict(result.data.Result);
                setDistrictOption(optionDistrict);
                // console.log(result)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeDistrict = (selectedOption) => {
        setAddress({ ...address, state: selectedOption.value })
        fetchCity(selectedOption.value)
    }

    const [city, setCity] = useState([])
    const [cityOption, setCityOption] = useState([])
    const fetchCity = async (state_id) => {
        try {
            const result = await axios.get(`${BASE_URL}/super/local_level/${state_id}`);
            if (result.data.Status) {
                const optionCity = result.data.Result.map(d => ({ value: d.cid, label: d.city_name }));
                setCity(result.data.Result);
                setCityOption(optionCity);
                // console.log(result)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeCity = (selectedOption) => {
        setAddress({ ...address, city: selectedOption.value })
    }

    const [ispermanent, setIsPermanent] = useState(false);
    const handleCheckboxChange = (e) => {
        setIsPermanent(e.target.checked)
    }

    useEffect(() => {

        fetchState();
        fetchDistrict();
    }, []);
    return (
        <>
            <div className="row">
                <div className="font-weight-bold">
                    ठेगानाः
                </div>
                <div className="col mb-3">
                    <label htmlFor="state">प्रदेश</label>
                    <Select
                        name='state' id='state'
                        className='custom-input'
                        options={stateOption}
                        value={stateOption.find(
                            option => option.value === stateOption.state_id
                        )}
                        onChange={changeState}
                        placeholder='प्रदेश'
                        required
                    />
                </div>
                <div className="col mb-3">
                    <label htmlFor="district">जिल्ला</label>
                    <Select
                        name='district' id='district'
                        className='custom-input'
                        options={districtOption}
                        value={districtOption.find(
                            option => option.value === districtOption.state_id
                        )}
                        onChange={changeDistrict}
                        placeholder='जिल्ला'
                        required
                    />
                </div>

                <div className="col mb-3">
                    <label htmlFor="city">न.पा./गा.पा.</label>
                    <Select
                        name='city' id='city'
                        className='custom-input'
                        options={cityOption}
                        value={cityOption.find(
                            option => option.value === cityOption.state_id
                        )}
                        onChange={changeCity}
                        placeholder='न.पा./गा.पा.'
                        required
                    />
                </div>
                <div className="col mb-3 pt-2">
                    <label htmlFor="ward">वडा नं.</label>
                    <input type="number" name='ward' placeholder='वडा नं.'
                        className='custom-input' style={{ width: '55px' }}
                        value={address.ward}
                        onChange={(e) => setAddress({ ...address, ward: e.target.value })}
                        required
                    />
                </div>
                <div className="col mb-3 pt-2">
                    <label htmlFor='is_permanent'>
                        <input
                            type="checkbox"
                            checked={ispermanent}
                            onChange={handleCheckboxChange}
                        /> &nbsp;
                        स्थायी ठेगाना हो/होइन(?)
                    </label>
                </div>
                <div className="col pt-3">
                    <button className='btn btn-success btn-sm'>+</button>
                </div>
            </div>
        </>
    )
}

export default CreateAddress