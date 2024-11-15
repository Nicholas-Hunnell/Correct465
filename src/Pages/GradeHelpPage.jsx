import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradesDisplay from '../Components/GradeDisplay'; // Import the GradesDisplay component
import GradeHelpPet from '../Components/GradeHelpPet'; // Import the GradeHelpPet component

const GradeHelpPage = () => {
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

    return (
        <div style={styles.pageContainer}>
            {/* Left container with grades and any other relevant components */}
            <div style={styles.leftContainer}>
                <h1>Canvas Grades</h1>
                <GradesDisplay token={token} />
            </div>

            {/* Right container with the GradeHelpPet component */}
            <div style={styles.rightContainer}>
                <GradeHelpPet />
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        padding: '20px',
    },
    leftContainer: {
        flex: 1,
        textAlign: 'center',
    },
    rightContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

export default GradeHelpPage;
