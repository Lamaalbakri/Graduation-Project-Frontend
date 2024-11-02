import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAddressByUserId } from '../api/addressApi';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [address, setAddress] = useState(null);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const fetchedAddress = await getAddressByUserId();
                setAddress(fetchedAddress);
            } catch (error) {
                console.error("Error fetching address:", error);
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
