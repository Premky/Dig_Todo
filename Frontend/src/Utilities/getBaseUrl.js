import axios from 'axios';

const primaryUrl = import.meta.env.VITE_API_BASE_URL_PRIMARY;
const secondaryUrl = import.meta.env.VITE_API_BASE_URL_SECONDARY;
const ternaryUrl = import.meta.env.VITE_API_BASE_URL_TERNARY;

// Function to check if a URL is reachable
const isUrlAvailable = async (url) => {
    try {
        // console.log('url', url)
        const response = await axios.get(`${url}/display/ranks`, { timeout: 2000 }); // You can use a simple health-check endpoint
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

// Function to get the working base URL
export const getBaseUrl = async () => {
    if (await isUrlAvailable(primaryUrl)) {
        // console.log('primary', primaryUrl)
        return primaryUrl;
    } else if (await isUrlAvailable(secondaryUrl)) {
        // console.log(secondaryUrl)
        return secondaryUrl;
    } else if (await isUrlAvailable(ternaryUrl)) {
        // console.log(ternaryUrl)
        return ternaryUrl;
    } else {
        throw new Error('No available API URLs');
    }
};

