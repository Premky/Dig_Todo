import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InputLabel, TextField, Autocomplete, Box } from '@mui/material';
import { Controller } from 'react-hook-form';

const ReuseMedical = ({ name, label, required, control, error, medicaltype }) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');

    // State to store medical options
    const [formattedOptions, setFormattedOptions] = useState([]);

    // Fetch medical data
    const fetchMedical = async () => {
        try {
            const url = `${BASE_URL}/public/get_lisence_category`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Array.isArray(Result) && Result.length > 0) {
                    const formatted = Result.map((opt) => ({
                        label: opt.name_en, // Use English name
                        value: opt.id, // Use ID as value
                    }));
                    setFormattedOptions(formatted);
                } else {
                    console.log('No records found.');
                }
            } else {
                console.log(Error || 'Failed to fetch records.');
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    // Predefined options for eye and ear
    const eyeOptions = [{ label: 'देख्ने', value: 1 }, { label: 'नदेख्ने', value: 0 }];
    const earOptions = [{ label: 'सुन्ने', value: 1 }, { label: 'नसुन्ने', value: 0 }];
    const medicineOptions = [{ label: ' गर्ने', value: 1 }, { label: ' नगर्ने', value: 0 }];
    const mentalOptions = [{ label: ' ठिक', value: 1 }, { label: ' बेठिक', value: 0 }];

    // Use useEffect to update options based on medicaltype
    useEffect(() => {
        if (medicaltype === 'eye') {
            setFormattedOptions(eyeOptions);
        } else if (medicaltype === 'ear') {
            setFormattedOptions(earOptions);
        } else if (medicaltype === 'medicine') {
            setFormattedOptions(medicineOptions);
        } else if (medicaltype === 'mental') {
            setFormattedOptions(mentalOptions);
        } else {
            fetchMedical(); // Fetch external data if needed
        }
    }, [medicaltype]); // Trigger when medicaltype changes

    return (
        <>
            <InputLabel id={name}>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
            </InputLabel>

            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                    <Autocomplete
                        id={name}
                        options={formattedOptions} // Use fetched or predefined options
                        autoHighlight
                        getOptionLabel={(option) => option.label || ''} // Prevent crashes if `label` is missing
                        value={formattedOptions.find((option) => option.value === value) || null} // Ensure selected value matches
                        onChange={(_, newValue) => onChange(newValue ? newValue.value : '')} // Store only value
                        sx={{ width: '100%' }}
                        renderOption={(props, option) => (
                            <Box key={option.value} component="li" {...props}>
                                {option.label}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputRef={ref}
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="normal"
                                error={!!error}
                                helperText={error?.message || ""}
                                required={required}
                            />
                        )}
                    />
                )}
            />
        </>
    );
};

export default ReuseMedical;
