const API_URL = 'http://localhost:8500/api/v1';

//get request 

export const fetchAllCurrentRequests = async () => {
    const response = await fetch(`${API_URL}/rawMaterialCurrentRequest`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; //return all data
};

export const fetchAllPreviousRequests = async () => {
    const response = await fetch(`${API_URL}/rawMaterialPreviousRequest`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; //return all data
};

// change status
export const updateRawMaterialRequestStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus }) // send the new state
        });

        if (!response.ok) {
            return { error: "Failed to update the status" };
        }

        return await response.json(); // get responce
    } catch (error) {
        return { error: "problem with the server" };
    }
};

export const deleteCurrentRequestById = async (id) => {
    const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        return { error: "Error deleting current request" };
    }

    // If the response is 204, do not try to read JSON.
    if (response.status !== 204) {
        const data = await response.json(); // Just try to read the JSON if the response is not 204
        return data; // Receive responce after deletion
    }

    return { msg: 'Request deleted successfully' };
}

//search current by id
export const searchCurrentRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/${id}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `No requests found for this id: ${id}` }; //msg for not found req error
            } else if (response.status === 401) {
                return { error: 'Unauthorized access. Please check your permissions.' }; //msg for unauth access error
            }
            // return { error: 'problem with the server' }; //msg for any other error
        }

        const json = await response.json();
        return json.data; // return search result
    } catch (error) {
        return { error: "problem with the server" };
    }
};


//search current by manufacturer name
export const searchCurrentRequestByMName = async (MName) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/manufacturerName/${MName}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `No requests found for manufacturer name: ${MName}` }; //msg for not found req error
            } else if (response.status === 401) {
                return { error: 'Unauthorized access. Please check your permissions.' }; //msg for unauth access error
            }
            //return { error: 'problem with the server' }; ////msg for any other error
        }

        const json = await response.json();
        return json.data; //return search result
    } catch (error) {
        return { error: "problem with the server" };
    }
};

//search Previous by id
export const searchPreviousRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialPreviousRequest/${id}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `No requests found for this id: ${id}` }; //msg for not found req error
            } else if (response.status === 401) {
                return { error: 'Unauthorized access. Please check your permissions.' }; //msg for unauth access error
            }
            //return { error: 'problem with the server' }; //msg for any other error
        }
        const json = await response.json();
        return json.data; // return search result
    } catch (error) {
        return { error: "problem with the server" };
    }
};

//search Previous by manufacturer name
export const searchPreviousRequestByMName = async (MName) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialPreviousRequest/manufacturerName/${MName}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `No requests found for manufacturer name: ${MName}` }; //msg for not found req error
            } else if (response.status === 401) {
                return { error: 'Unauthorized access. Please check your permissions.' }; //msg for unauth access error
            }
            //return { error: 'problem with the server' }; //msg for any other error
        }
        const json = await response.json();
        return json.data; // return search result
    } catch (error) {
        return { error: "problem with the server" };
    }
};

//move currnt request to preveious request
export const moveCurrentToPrevious = async (id) => {

    try {
        // Step 1: Get the request from the current requests
        const currentRequest = await searchCurrentRequestById(id);

        // Step 2: Send the request to the previous requests list
        const response = await fetch(`${API_URL}/rawMaterialPreviousRequest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentRequest) // Submit the request as is.
        });

        if (!response.ok) {
            return { error: `Error moving request to previous` };
        }

        // Step 3: Delete the request from the current requests list
        await deleteCurrentRequestById(id);

        return await response.json(); //return responce
    } catch (error) {
        return { error: `Error moving request to previous` };
    }
};



