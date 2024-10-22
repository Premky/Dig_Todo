const convertToNepaliDate = (isoDate) => {
    const datePart = isoDate.split('T')[0]; // Extract just the date part
    const englishToNepaliMap = {
        '0': '०',
        '1': '१',
        '2': '२',
        '3': '३',
        '4': '४',
        '5': '५',
        '6': '६',
        '7': '७',
        '8': '८',
        '9': '९',
    };

    // return datePart; // Return in the format needed for the NepaliDatePicker
    return datePart.split('').map(char => englishToNepaliMap[char] || char).join('');
}

export default convertToNepaliDate;