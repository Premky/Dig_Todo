import React, { useEffect } from 'react';

const NepaliDatePickerComponent = () => {
    useEffect(() => {
        // Load the Nepali Datepicker script dynamically
        const script = document.createElement('script');
        script.src = "https://nepalidatepicker.sajanmaharjan.com.np/nepali.datepicker/js/nepali.datepicker.v4.0.4.min.js";
        script.async = true;
        document.body.appendChild(script);

        // Initialize the datepicker once the script is loaded
        script.onload = () => {
            const mainInput = document.getElementById("nepali-datepicker");
            if (mainInput && mainInput.nepaliDatePicker) {
                mainInput.nepaliDatePicker();
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <p>
                <input type="text" id="nepali-datepicker" placeholder="Select Nepali Date" />
            </p>
        </div>
    );
}

export default NepaliDatePickerComponent;
