import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InputLabel, TextField, Autocomplete } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Box } from '@mui/material';

const ReuseOffice = ({ name, label, required, control, error }) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');

    // State to store office options
    const [formattedOptions, setFormattedOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch office data
    const fetchOffices = async () => {
        try {
            const url = `${BASE_URL}/admin/get_offices`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Array.isArray(Result) && Result.length > 0) {
                    const formatted = Result.map((opt, index) => ({
                        sn: index + 1,
                        label: opt.name_np,
                        value: opt.id,
                    }));
                    setFormattedOptions(formatted);
                } else {
                    console.log('No records found.');
                }
            } else {
                console.log(Error || 'Failed to fetch.');
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOffices();
    }, []);

    return (
        <>
            <InputLabel id={name}>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
            </InputLabel>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <Controller
                    name={name}
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                        <Autocomplete
                            id={name}
                            options={formattedOptions} // Use fetched districts
                            autoHighlight
                            getOptionLabel={(option) => option.label || ''} // Prevents crashes if `label` is missing
                            value={formattedOptions.find((option) => option.value === value) || null} // Ensure selected value matches
                            onChange={(_, newValue) => onChange(newValue ? newValue.value : '')} // Store only value
                            sx={{ width: '100%' }}
                            // renderOption={(props, option) => (
                            //     <Box key={option.value} component="li" {...props}>
                            //         {option.label}
                            //     </Box>
                            // )}
                            renderInput={(params) => (
                                <TextField
                                    defaultValue=''
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
            )}
        </>
    );
};

export default ReuseOffice;
