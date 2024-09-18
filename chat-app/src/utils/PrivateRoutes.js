import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(null);
    const [userData, setUserData] = useState(null); // To store the fetched data

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsValid(false);
            return;
        }

        // Call backend to validate token
        const validateToken = async () => {
            try {
                const response = await fetch(`http://localhost:3001/validate-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();
                if (response.ok) {
                    setIsValid(true);
                    setUserData(data.user); // Assuming your backend sends back user data
                } else {
                    setIsValid(false);
                }
            } catch (error) {
                console.error('Error validating token', error);
                setIsValid(false);
            }
        };

        validateToken();
    }, []);

    // While token is being validated
    if (isValid === null) {
        return <div>Loading...</div>; // Or some loader/spinner
    }

    // Redirect to login if token is invalid
    return isValid ? React.cloneElement(children, { userData }) : <Navigate to="/login" />;
};

export default PrivateRoute;
