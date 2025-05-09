import { Autocomplete, TextField, InputLabel } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

const ReuseBranch = ({ name, label, required, control, error, selectedValue }) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');

    const [formattedOptions, setFormattedOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/admin/get_branch_name`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { Status, Result, Error } = response.data;

                if (Status && Array.isArray(Result) && Result.length > 0) {
                    const formatted = Result.map((opt) => ({
                        label: opt.name_np,
                        value: opt.id,
                    }));
                    setFormattedOptions(formatted);
                } else {
                    console.log(Error || 'No records found.');
                }
            } catch (error) {
                console.error('Error fetching records:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

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
                        options={formattedOptions}
                        autoHighlight
                        getOptionLabel={(option) => option.label || ''}
                        value={formattedOptions.find((option) => option.value === value) || null}
                        onChange={(_, newValue) => onChange(newValue ? newValue.value : '')}
                        sx={{ width: '100%' }}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputRef={ref}
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="normal"
                                error={!!error}
                                helperText={error?.message || ''}
                                required={required}
                            />
                        )}
                    />
                )}
            />
        </>
    );
};

export default ReuseBranch;
