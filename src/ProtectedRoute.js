import React from 'react';
import { Navigate, Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {

    const getUserToken = () => {
        return localStorage.getItem('userToken');
    };
    const verifyTokenOnServer = async (token) => {
        return fetch('http://localhost:3000/users/verifyToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        })
            .then((response) => response.json())
            .then((data) => data.isValid);
    };

    const checkTokenValidity = () => {
        const token = getUserToken();

        if (token) {
            return verifyTokenOnServer(token);
        }

        return false; 
    };
    const isAuthenticated = checkTokenValidity(); 

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Navigate to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute