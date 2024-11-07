import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAddressByUserId } from '../api/addressApi';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null); // يمكن تعديل userId حسب كيفية إدارته في التطبيق

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const fetchedAddress = await getAddressByUserId();
                setAddress(fetchedAddress);
            } catch (error) {
                console.error("Error fetching address:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, []);

    return (
        <AddressContext.Provider value={{ address, setAddress }}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => useContext(AddressContext);
