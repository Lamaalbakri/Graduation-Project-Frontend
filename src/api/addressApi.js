const API_URL = ' http://localhost:8500/api/v1/address';

// Function to get a specific address 
export const getAddressByUserId = async () => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "GET",
            credentials: 'include', //send request with token
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching address by ID');
        }

        const data = await response.json();
        return data.data; // Returns the address data
    } catch (error) {
        //console.error('Error fetching address by ID:', error);
        throw error;
    }
};

// Function to create a new address
export const createAddress = async (addressData) => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'POST',
            credentials: 'include', //send request with token
            body: JSON.stringify(addressData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error creating address');
        }

        const data = await response.json();
        return { success: true, message: data.msg, data: data.data }; // Returns the created address data
    } catch (error) {
        //console.error('Error creating address:', error);
        return { success: false, message: error.message };
    }
};

// Function to update an existing address
export const updateAddress = async (addressId, addressData) => {
    try {
        const response = await fetch(`${API_URL}/${addressId}`, {
            method: 'PUT',
            credentials: 'include', //send request with token
            body: JSON.stringify(addressData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error updating address');
        }

        const data = await response.json();
        return data.data; // Returns the updated address data
    } catch (error) {
        // console.error('Error updating address:', error);
        throw error;
    }
};

