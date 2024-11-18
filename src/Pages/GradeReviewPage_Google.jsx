import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradesDisplay_Google from '../Components/GradeDisplay_Google'; // Import the GradesDisplay component

const GradeReviewPage_Google = () => {
    const token = localStorage.getItem('googleToken'); // Retrieve token from localStorage
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login or show error if token is missing
        if (!token) {
            setError('Missing Google Token. Please log in again.');
        }
    }, [token]);

    // If there's an error, display the error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    // While loading, show a loading indicator
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render the GradesDisplay component, passing only the token
    return (
        <div>
            <h1>Google Classroom Grades</h1>
            <GradesDisplay_Google token={token} />
        </div>
    );
};

export default GradeReviewPage_Google;