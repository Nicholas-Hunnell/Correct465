import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradesDisplay from '../Components/GradeDisplayHelp.jsx';
import GradeHelpPet from '../Components/GradeHelpPet.jsx';
import GradeDisplay_Google from "../Components/GradeDisplay_Google.jsx";

const GradeHelpPage = () => {
    const token = localStorage.getItem('googleToken');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(null); // New state for selected grade
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Missing Google Token. Please log in again.');
        }
    }, [token]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }


    const handleGradeSelection = (grade) => {
        setSelectedGrade(grade);
    };

    return (
        <div style={styles.pageContainer}>
            {/* Left container */}
            <div style={styles.leftContainer}>
                <h1>Google Grades</h1>
                {/* Pass setSelectedGrade to GradesDisplay */}
                <GradeDisplay_Google token={token} setSelectedGrade={setSelectedGrade} onGradeSelect={handleGradeSelection}/>
            </div>

            {/* Right container */}
            <div style={styles.rightContainer}>
                {/* Pass selectedGrade to GradeHelpPet */}
                <GradeHelpPet selectedGrade={selectedGrade} />
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
