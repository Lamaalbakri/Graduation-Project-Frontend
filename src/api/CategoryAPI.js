
export const getSearchSupplierCategory = async (supplierCategory, supplierName) => {
    try {
        const response = await fetch(`http://localhost:8500/api/v1/supplier/${supplierCategory}/${supplierName}`, {
            method: "GET",
            credentials: 'include', // Sending cookies with orders
        });
        if (!response.ok) {
            console.log('api error: ', response)
        }
        const data = await response.json();
        return data.data
    } catch (error) {
        console.error('Error fetching order:', error);
    }
};

export const getSearchManufacturerCategory = async (manufacturerCategory, manufacturerName) => {
    try {
        const response = await fetch(`http://localhost:8500/api/v1/manufacturer/${manufacturerCategory}/${manufacturerName}`, {
            method: "GET",
            credentials: 'include', // Sending cookies with orders
        });
        if (!response.ok) {
            console.log('api error: ', response)
        }
        const data = await response.json();
        return data.data
    } catch (error) {
        console.error('Error fetching order:', error);
    }
};

export const getSearchDistributorCategory = async (distributorCategory, distributorName) => {
    try {
        const response = await fetch(`http://localhost:8500/api/v1/distributor/${distributorCategory}/${distributorName}`, {
            method: "GET",
            credentials: 'include', // Sending cookies with orders
        });
        if (!response.ok) {
            console.log('api error: ', response)
        }
        const data = await response.json();
        return data.data
    } catch (error) {
        console.error('Error fetching order:', error);
    }
};