import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradesDisplay from '../Components/GradeDisplayHelp'; 
import GradeHelpPet from '../Components/GradeHelpPet';

const GradeHelpPage = () => {
    const token = localStorage.getItem('canvasToken'); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      
        if (!token) {
            setError('Missing Canvas Token. Please log in again.');
        }
    }, [token]);


    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.pageContainer}>
            {/* Left container */}
            <div style={styles.leftContainer}>
                <h1>Canvas Grades</h1>
                <GradesDisplay token={token} />
            </div>

            {/* Right container */}
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
