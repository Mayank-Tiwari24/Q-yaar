import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [mobileNumber, setMobileNumber] = useState('');
    const [animationsPlayed, setAnimationsPlayed] = useState({});

    const loginUser = (mobile, data) => {
        setMobileNumber(mobile);
        setUserData(data);
    };

    const updateUserData = (data) => {
        setUserData(data);
    };

    const markAnimationPlayed = (screenName) => {
        setAnimationsPlayed(prev => ({ ...prev, [screenName]: true }));
    };

    const logoutUser = () => {
        setMobileNumber('');
        setUserData(null);
        setAnimationsPlayed({});
    };

    return (
        <UserContext.Provider value={{
            userData,
            mobileNumber,
            animationsPlayed,
            loginUser,
            updateUserData,
            markAnimationPlayed,
            logoutUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;
