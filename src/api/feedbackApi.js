const API_URL = ' http://localhost:8500/api/v1/feedback';

export const getFeedbackByUserId = async () => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "GET",
            credentials: 'include', //send request with token
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching feedback by ID');
        }

        const data = await response.json();
        return data.data; // Returns the address data
    } catch (error) {
        //console.error('Error fetching address by ID:', error);
        throw error;
    }
};

// Function to create a new address
export const createFeedback = async (feedbackData) => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'POST',
            credentials: 'include', //send request with token
            body: JSON.stringify(feedbackData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error creating feedback');
        }

        const data = await response.json();
        return { success: true, message: data.msg, data: data.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getBuyerFeedback = async () => {
    try {
        const response = await fetch(`${API_URL}/buyer-feedback`, {
            method: "GET",
            credentials: 'include', //send request with token
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching feedback by ID');
        }

        const data = await response.json();
        return data.data; // Returns the address data
    } catch (error) {
        //console.error('Error fetching address by ID:', error);
        throw error;
    }
};