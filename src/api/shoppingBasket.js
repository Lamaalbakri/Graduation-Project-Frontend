const API_URL = 'http://localhost:8500/api/v1/shoppingBasket';


export const fetchShoppingBasketList = async () => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `There is no Basket created yet` };
            }
            return { error: `Error in get basket` };
        }

        const data = await response.json();
        return data.data; // إرجاع البيانات التي تم جلبها
    } catch (err) {
        return { error: `Error fetching shopping carts` };
    }
};


export const fetchShoppingBasketDetails = async ({ sellerId, sellerName }) => {
    try {
        const response = await fetch(`${API_URL}/details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ sellerId, sellerName })
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `There is no Basket created yet` };
            }
            return { error: `Error in get basket` };
        }

        const data = await response.json();
        console.log(data)
        return data.data; // إرجاع البيانات التي تم جلبها
    } catch (err) {
        return { error: `Error fetching shopping carts` };
    }
};