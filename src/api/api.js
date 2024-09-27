import axios from 'axios';

const API_URL = 'http://localhost:8500/api/v1'; // Change this if your backend runs on a different port

export const getRawMaterialRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/rawMaterialRequest`);
        return response.data;
    } catch (error) {
        console.error("Error fetching raw material requests:", error);
        throw error;
    }
};
