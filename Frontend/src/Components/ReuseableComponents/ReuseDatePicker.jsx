import React, { useState } from 'react'
import Calendar from '@sbmdkl/nepali-datepicker-reactjs';
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';

const ReuseDatePicker = ({ onDateChange, defaultValue, theme }) => {
    const [date, setDate] = useState(defaultValue || '');

    const handleDate = ({ bsDate }) => {
        setDate(bsDate);
        if (onDateChange) {
            onDateChange(bsDate);
        }
    };
    //  Theme supports : red blue green dark deepdark default.
    return (
        <div>
            <Calendar
                onChange={handleDate}
                value={date}
                theme={theme || 'default'}
            />
        </div>
    );
};

export default ReuseDatePicker;
