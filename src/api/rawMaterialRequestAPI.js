const API_URL = 'http://localhost:8500/api/v1';

//get request 

export const fetchAllCurrentRequests = async () => {
    const response = await fetch(`${API_URL}/rawMaterialCurrentRequest`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة جميع البيانات
};

export const fetchAllPreviousRequests = async () => {
    const response = await fetch(`${API_URL}/rawMaterialPreviousRequest`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة جميع البيانات
};

// change status
export const updateRawMaterialRequestStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus }) // إرسال الحالة الجديدة
        });

        if (!response.ok) {
            throw new Error('Failed to update the status');
        }

        return await response.json(); // استلام الرد
    } catch (error) {
        console.error("Error updating the status:", error);
        throw error; // إعادة الخطأ ليتسنى التعامل معه في مكان آخر
    }
};

//search current by id
export const searchCurrentRequestById = async (id) => {
    const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/${id}`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة البيانات المستردة
};

//search Previous by id
export const searchPreviousRequestById = async (id) => {
    const response = await fetch(`${API_URL}/rawMaterialPreviousRequest/${id}`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة البيانات المستردة
};


