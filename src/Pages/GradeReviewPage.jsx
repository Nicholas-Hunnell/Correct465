import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradesDisplay from '../Components/GradeDisplay'; // Import the GradesDisplay component

const GradeReviewPage = () => {
    const token = localStorage.getItem('canvasToken'); // Retrieve token from localStorage
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login or show error if token is missing
        if (!token) {
            setError('Missing Canvas Token. Please log in again.');
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
            <h1>Canvas Grades</h1>
            <GradesDisplay token={token} />
        </div>
    );
};

export default GradeReviewPage;