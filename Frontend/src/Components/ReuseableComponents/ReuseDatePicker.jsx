import React, { useState } from 'react'
import Calendar from '@sbmdkl/nepali-datepicker-reactjs';
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';

const ReuseDatePicker = ({ onDateChange, defaultValue, theme, required }) => {
    const [date, setDate] = useState(defaultValue || '');

    // Function to convert Nepali numerals to English
    const convertToEnglishDigits = (nepaliStr) => {
        const nepaliNums = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        return nepaliStr.split('').map(char => {
            const index = nepaliNums.indexOf(char);
            return index > -1 ? index : char;
        }).join('');
    };

    const handleDate = ({ bsDate }) => {
        const englishDate = convertToEnglishDigits(bsDate);
        setDate(englishDate);
        // console.log(englishDate);
        // Call the onDateChange function if provided
        if (onDateChange) {
            onDateChange(englishDate);
        }
    };
    //  Theme supports : red blue green dark deepdark default.
    return (
        <div>
            <Calendar
                onChange={handleDate}
                value={date}
                theme={theme || 'default'}
                required={required}
            />
        </div>
    );
};

export default ReuseDatePicker;
