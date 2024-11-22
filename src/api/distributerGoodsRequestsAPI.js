const API_URL = 'http://localhost:8500/api/v1';

//get request 
export const fetchAllDistributorsGoodsCurrentRequests = async () => {
    const response = await fetch(`${API_URL}/goodsDistributorsCurrentRequest`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; //return all data
};

export const fetchAllDistributorsGoodsPreviousRequests = async () => {
    const response = await fetch(`${API_URL}/goodsDistributorsPreviousRequest`, {
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
export const updateDistributorsGoodsRequestStatus = async (id, newStatus) => {
    //console.log("Sending request to update status:", newStatus, id);
    try {
        const response = await fetch(`${API_URL}/goodsDistributorsCurrentRequest/${id}`, {
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
        //console.log(await response.json());
        return await response.json(); // get responce
    } catch (error) {
        return { error: "problem with the server" };
    }
};

export const deleteDistributorsGoodsCurrentRequestById = async (id) => {
    const response = await fetch(`${API_URL}/goodsDistributorsCurrentRequest/${id}`, {
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

export const deleteDistributorsGoodsPreviousRequestById = async (id) => {
    const response = await fetch(`${API_URL}/goodsDistributorsPreviousRequest/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        return { error: "Error deleting Previous request" };
    }

    // If the response is 204, do not try to read JSON.
    if (response.status !== 204) {
        const data = await response.json(); // Just try to read the JSON if the response is not 204
        return data; // Receive responce after deletion
    }

    return { msg: 'Request deleted successfully' };
}
//search current by id
export const searchDistributorsGoodsCurrentRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/goodsDistributorsCurrentRequest/${id}`, {
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


export const searchDistributorsGoodsCurrentRequestByMName = async (MName) => {
    try {
        const response = await fetch(`${API_URL}/goodsDistributorsCurrentRequest/retailerName/${MName}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `No requests found for retailer name: ${MName}` }; //msg for not found req error
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
export const searchDistributorsGoodsPreviousRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/goodsDistributorsPreviousRequest/${id}`, {
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

export const searchDistributorsGoodsPreviousRequestByMName = async (MName) => {
    try {
        const response = await fetch(`${API_URL}/goodsDistributorsPreviousRequest/retailerName/${MName}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `No requests found for retailer name: ${MName}` }; //msg for not found req error
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
export const moveDistributorsGoodsCurrentToPrevious = async (id) => {

    try {
        // Step 1: Get the request from the current requests
        const currentRequestID = await searchDistributorsGoodsCurrentRequestById(id);

        console.log(`called here searchCurrentRequestById ${currentRequestID}`)
        // Step 2: Send the request to the previous requests list
        const response = await fetch(`${API_URL}/goodsDistributorsPreviousRequest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...currentRequestID,
                shortId: currentRequestID.shortId 
            })
        });

        if (!response.ok) {
            return { error: `Error moving request to previous` };
        }

        // Step 3: Delete the request from the current requests list
        await deleteDistributorsGoodsCurrentRequestById(id);
        return await response.json(); //return responce
    } catch (error) {
        return { error: `Error moving request to current` };
    }
};

export const createNewDistributorsGoodsRequest = async (data) => {
    try {
        const response = await fetch(`${API_URL}/goodsDistributorsCurrentRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.insufficientItems && errorData.insufficientItems.length > 0) {
                return { error: "Some items are unavailable or have low stock.", insufficientItems: errorData.insufficientItems };
            }
            throw new Error(`Failed to create request: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        return { error: error.message || "Error creating new request" };
    }
};