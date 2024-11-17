const API_URL = 'http://localhost:8500/api/v1/contract';

export const createContract = async (transportOrderId, purchaseOrderId) => {
    try {
        const response = await fetch(`${API_URL}/create-contract`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                transportOId: transportOrderId,
                purchaseOId: purchaseOrderId
            }),
        });

        const jsonResponse = await response.json();

        if (!response.ok) {
            console.error('Error response:', jsonResponse);
            throw new Error(jsonResponse.message || "Failed to create contract.");
        }

        return jsonResponse;

    } catch (error) {
        console.error("Error sending transport request:", error);
        throw error;
    }
}

export const getContract = async (orderId) => {
    console.log(orderId)
    const response = await fetch(`${API_URL}/view-contract/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to get contract, ${errorDetails}`);
    }

    const json = await response.json();
    return json.data;
}

export const updateContract = async (orderId) => {
    try {
        const response = await fetch(`${API_URL}/update-contract`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ orderId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to update the contract');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating the contract:", error);
        throw error;
    }
}