import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [resultData, setResultData] = useState(null); // Global state for AI results

    return (
        <DataContext.Provider value={{ resultData, setResultData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);