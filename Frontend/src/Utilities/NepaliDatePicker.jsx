import React, { useEffect } from 'react';

const NepaliDatePicker = () => {

  useEffect(() => {
    // Dynamically load the CSS for the datepicker
    const link = document.createElement("link");
    link.href = "https://nepalidatepicker.sajanmaharjan.com.np/nepali.datepicker/css/nepali.datepicker.v4.0.5.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Dynamically load the JS for the datepicker
    const script = document.createElement("script");
    script.src = "https://nepalidatepicker.sajanmaharjan.com.np/nepali.datepicker/js/nepali.datepicker.v4.0.5.min.js";
    script.async = true;
    script.onload = () => {
      // Delay to ensure the input field is rendered before initializing the datepicker
      setTimeout(() => {
        const mainInput = document.getElementById("nepali-datepicker");
        if (mainInput) {
          mainInput.nepaliDatePicker(); // Initialize the datepicker
        }
      }, 100); // Small delay to ensure input is fully mounted
    };
    document.body.appendChild(script);

    // Cleanup to remove the script and link when the component is unmounted
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <input type="text" id="nepali-datepicker" placeholder="Select Nepali Date" />
    </div>
  );
};

export default NepaliDatePicker;
