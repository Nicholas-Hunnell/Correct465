import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradesDisplay from '../Components/GradeDisplay';  // Import the GradesDisplay component
//change
const GradeReviewPage = () => {
    const token = localStorage.getItem('canvasToken');
    console.log('Canvas token:', token);
    const [error, setError] = useState(null);
    const [canvasUserId, setCanvasUserId] = useState(localStorage.getItem('canvasUserId')); // Initially from localStorage
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch the Canvas User ID if it is not available
    useEffect(() => {
        if (!token) {
            setError('Missing Canvas Token');
            return;
        }

        // If the Canvas User ID is not in localStorage, fetch it from the server
        if (!canvasUserId) {
            setLoading(true);
            fetchCanvasUserInfo(token)
                .then(userId => {
                    console.log(userId.splice(-7))
                    localStorage.setItem('canvasUserId', userId.slice(-7));  // Save the Canvas User ID to localStorage
                    setCanvasUserId(userId);  // Update state
                })
                .catch((err) => {
                    setError('Error fetching Canvas user info: ' + err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [token, canvasUserId]);

    // Function to fetch Canvas user info
    const fetchCanvasUserInfo = async (token) => {
        try {
            console.log("token being sent", token);
            const response = await fetch('http://127.0.0.1:3001/canvas/get_canvas_account_info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Canvas account info');
            }

            const data = await response.json();
            const userId = data.userId; // Use the correct Canvas User ID
            console.log('Fetched Canvas User ID:', userId);
            return userId;  // Return the Canvas User ID
        } catch (err) {
            throw new Error('Error fetching Canvas user info: ' + err.message);
        }
    };

    // If there's an error, display the error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    // While loading, show a loading indicator
    if (loading) {
        return <div>Loading Canvas User Info...</div>;
    }

    // If the token and Canvas User ID are available, render the GradesDisplay component
    return (
        <div>
            <h1>Canvas Grades</h1>
            {canvasUserId && <GradesDisplay token={token} canvasUserId={canvasUserId.slice(-7)} />}
        </div>
    );
};

export default GradeReviewPage;
