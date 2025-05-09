import React from 'react';
import { InputLabel, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const ReuseInput = ({ name, label, required, control, error, placeholder,type, readonly,length }) => {
    return (
        <>
            <InputLabel id={name}>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
            </InputLabel>

            <Controller
                name={name}
                control={control}
                defaultValue=""  // Provide a default value
                render={({ field }) => (
                    <TextField
                        {...field}
                        id={name}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="normal"
                        error={!!error}
                        helperText={error?.message || ""}
                        required={required} // ✅ Corrected the required prop
                        placeholder={placeholder}
                        type={type||'text'}
                        readonly={readonly}
                        inputProps={{ maxLength: length || 255 }} // Set max length
                    />
                )}
            />
        </>
    );
};

export default ReuseInput;
