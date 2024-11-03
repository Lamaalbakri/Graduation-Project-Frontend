const API_URL = 'http://localhost:8500/api/v1';

//get request 

export const fetchAllCurrentRequests = async () => {
    const response = await fetch(`${API_URL}/manageRawMaterial`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة جميع البيانات
};
