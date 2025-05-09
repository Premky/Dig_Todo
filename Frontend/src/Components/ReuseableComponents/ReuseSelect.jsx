import React from 'react';
import { InputLabel, TextField, Autocomplete } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Box } from '@mui/material';

const ReuseSelect = ({ name, label, required, control, error, options = [] }) => {
    const defaultOptions = [
        { code: '', label: 'No Options Available', phone: '', value: '' }
    ];
    options = options && options.length ? options : defaultOptions;
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
                        options={Array.isArray(options) ? options : []}  // Ensure options is always an array
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        value={options.find((option) => option.value === value) || null}  // Match using value
                        onChange={(_, newValue) => onChange(newValue ? newValue.value : '')}  // Store only value
                        sx={{ width: '100%' }}

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

export default ReuseSelect;
