const API_URL = 'http://localhost:8500/api/v1/shoppingBasket';


export const addItemToBasket = async ({ item_id, quantity, options, sellerName, sellerId }) => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ item_id, quantity, options, sellerName, sellerId })
        });
        // const { item_id, quantity, options, sellerName, sellerId } = req.body;
        if (!response.ok) {
            if (response.status === 404) {
                return { error: `Item not found` };
            }
            return { error: `Failed to add item to cart` };
        }

        const data = await response.json();
        return { basket: data.data, numberOfBasketItems: data.numberOfBasketItems };
    } catch (err) {
        return { error: `Failed to add item to cart` };
    }
};

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
        return { basket: data.data, numberOfBasketItems: data.numberOfBasketItems };
    } catch (err) {
        return { error: `Error fetching shopping basket` };
    }
};



export const deleteBasket = async ({ basketId }) => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ basketId })
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `There is no basket` };
            }
            return { error: `Error in delete basket` };
        }

        const data = await response.json();
        return { message: data.message, numberOfBasketItems: data.numberOfBasketItems };
    } catch (err) {
        return { error: `Error deleting basket` };
    }
};

export const fetchShoppingBasketDetails = async ({ basketId }) => {
    try {
        const response = await fetch(`${API_URL}/details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ basketId })
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `There is no Basket created yet` };
            }
            return { error: `Error in get basket` };
        }

        const data = await response.json();
        // console.log(data)
        return { basket: data.data, numberOfBasketItems: data.numberOfBasketItems };
    } catch (err) {
        return { error: `Error fetching shopping basket` };
    }
};

export const updateBasketItemQuantity = async ({ basketId, newQuantity, itemId }) => {
    try {
        //console.log(itemId, basketId, newQuantity)
        const response = await fetch(`${API_URL}/itemId`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ basketId, quantity: newQuantity, itemId })
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `There is no item` };
            }
            return { error: `Error in update item` };
        }

        const data = await response.json();
        // console.log(data)
        return { basket: data.data, numberOfBasketItems: data.numberOfBasketItems };
    } catch (err) {
        return { error: `Error fetching shopping basket` };
    }
};

export const deleteItemFromBasket = async ({ itemId, basketId }) => {
    try {
        const response = await fetch(`${API_URL}/itemId`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ itemId, basketId })
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: `There is no item` };
            }
            return { error: `Error in delete item` };
        }

        const data = await response.json();
        // console.log(data)
        return { basket: data.data, numberOfBasketItems: data.numberOfBasketItems };
    } catch (err) {
        return { error: `Error fetching shopping basket` };
    }
};