export const getOrders = async () => {
    try {
        const response = await fetch('http://localhost:8500/api/v1/rawMaterialCurrentRequest/manufacturer/order', {
            method: 'GET',
            credentials: 'include'
        });
        let data = await response.json();
        const response1 = await fetch('http://localhost:8500/api/v1/rawMaterialPreviousRequest/manufacturer/order', {
            method: "GET",
            credentials: 'include', // Sending cookies with orders
        });
        const data1 = await response1.json();
        data = (data.data || []).concat(data1.data)

        return data
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

export const getSingleOrder = async (id) => {
    try {
        try {
            const response = await fetch(`http://localhost:8500/api/v1/rawMaterialPreviousRequest/${id}`, {
                method: "GET",
                credentials: 'include', // Sending cookies with orders
            });
            if (!response.ok) {
                const res = await fetch(`http://localhost:8500/api/v1/rawMaterialCurrentRequest/${id}`, {
                    method: "GET",
                    credentials: 'include', // Sending cookies with orders
                });
                const data = await res.json();
                return (data.data);
            }
            const data = await response.json();
            return data.data
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

// distributor
export const getMOrders = async () => {
    try {
        const response = await fetch('http://localhost:8500/api/v1/goodsManufacturersCurrentRequest/distributor/order', {
            method: 'GET',
            credentials: 'include'
        });
        let data = await response.json();
        const response1 = await fetch('http://localhost:8500/api/v1/goodsManufacturersPreviousRequest/distributor/order', {
            method: "GET",
            credentials: 'include', // Sending cookies with orders
        });
        const data1 = await response1.json();
        data = (data.data || []).concat(data1.data)

        return data
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

export const getSingleMOrder = async (id) => {
    try {
        try {
            const response = await fetch(`http://localhost:8500/api/v1/goodsManufacturersPreviousRequest/${id}`, {
                method: "GET",
                credentials: 'include', // Sending cookies with orders
            });
            if (!response.ok) {
                const res = await fetch(`http://localhost:8500/api/v1/goodsManufacturersCurrentRequest/${id}`, {
                    method: "GET",
                    credentials: 'include', // Sending cookies with orders
                });
                const data = await res.json();
                return (data.data);
            }
            const data = await response.json();
            return data.data
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};


// retailer
export const getDOrders = async () => {
    try {
        const response = await fetch('http://localhost:8500/api/v1/goodsDistributorsCurrentRequest/retailer/order', {
            method: 'GET',
            credentials: 'include'
        });
        let data = await response.json();
        const response1 = await fetch('http://localhost:8500/api/v1/goodsDistributorsPreviousRequest/retailer/order', {
            method: "GET",
            credentials: 'include', // Sending cookies with orders
        });
        const data1 = await response1.json();
        data = (data.data || []).concat(data1.data)

        return data
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

export const getSingleDOrder = async (id) => {
    try {
        try {
            const response = await fetch(`http://localhost:8500/api/v1/goodsDistributorsPreviousRequest/${id}`, {
                method: "GET",
                credentials: 'include', // Sending cookies with orders
            });
            if (!response.ok) {
                const res = await fetch(`http://localhost:8500/api/v1/goodsDistributorsCurrentRequest/${id}`, {
                    method: "GET",
                    credentials: 'include', // Sending cookies with orders
                });
                const data = await res.json();
                return (data.data);
            }
            const data = await response.json();
            return data.data
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};