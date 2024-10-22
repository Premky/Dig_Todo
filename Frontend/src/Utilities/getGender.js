// Synchronous getGender function
const getGender = (gender) => {
    if (gender === 'M') {
        return 'पुरुष';
    }
    if (gender === 'F') {
        return 'महिला';
    }
    if (gender === 'O') {
        return 'अन्य';
    }
    return 'अज्ञात'; // Fallback value
};

export default getGender;
