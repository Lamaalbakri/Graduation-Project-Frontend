const API_URL = 'http://localhost:8500/api/v1';

// fetch transportation companies
export const fetchCompanies = async () => {
    const response = await fetch(`${API_URL}/transportRequests`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to fetch company list: ${response.status} ${errorDetails}`);
    }
    const json = await response.json();
    return json.data; //return all data
};

export const sendTransportRequest = async (requestData) => {
    try {
        const response = await fetch(`${API_URL}/transportCurrentRequest`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        const jsonResponse = await response.json();

        if (!response.ok) {
            console.error('Error response:', jsonResponse);
            throw new Error(jsonResponse.message || "Failed to send request.");
        }

        return jsonResponse;

    } catch (error) {
        console.error("Error sending transport request:", error);
        throw error;
    }
};

// get current request 
export const fetchAllCurrentTransportRequests = async () => {
    const response = await fetch(`${API_URL}/transportCurrentRequest`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data;
};

// get previous request 
export const fetchAllPreviousTransportRequests = async () => {
    const response = await fetch(`${API_URL}/transportPreviousRequest`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data;
};

// change status
export const updateTransportRequestStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`${API_URL}/transportCurrentRequest/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus }) 
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.msg || 'Failed to update the status');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating the status:", error);
        throw error;
    }
};

// delete
export const deleteTransportCurrentRequestById = async (id) => {
    const response = await fetch(`${API_URL}/transportCurrentRequest/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Error deleting current request: ${response.status}`);
    }

    if (response.status !== 204) {
        const data = await response.json();
        return data;
    }

    return { msg: 'Request deleted successfully' };
};

// search current by id
export const searchTransportCurrentRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/transportCurrentRequest/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            if (response.status === 404) {
                return { error: `No requests found for this id: ${id}` }; //msg for not found req error
            } else if (response.status === 401) {
                return { error: 'Unauthorized access. Please check your permissions.' }; //msg for unauth access error
            }
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        return { error: "problem with the server" };
    }
};

// search previous by id
export const searchTransportPreviousRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/transportPreviousRequest/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            if (response.status === 404) {
                return { error: `No requests found for this id: ${id}` }; //msg for not found req error
            } else if (response.status === 401) {
                return { error: 'Unauthorized access. Please check your permissions.' }; //msg for unauth access error
            }
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        return { error: "problem with the server" };
    }
};

// move currnt request to preveious request
export const moveTransportRequestCurrentToPrevious = async (id) => {

    try {
        const currentTransportRequest = await searchTransportCurrentRequestById(id);

        const response = await fetch(`${API_URL}/transportPreviousRequest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentTransportRequest)
        });

        if (!response.ok) {
            return { error: `Error moving request to previous` };
        }

        await deleteTransportCurrentRequestById(id);

        return await response.json();
    } catch (error) {
        return { error: `Error moving request to previous` };
    }
};