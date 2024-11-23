import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradesDisplay from '../Components/GradeDisplay';
import CourseGradesDisplay from '../Components/OverallCanvasGrades.jsx';

const GradeReviewPage = () => {
    const token = localStorage.getItem('canvasToken');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(null);

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

    const handleGradeSelection = (grade) => {
        setSelectedGrade(grade);
    };

    return (
        <div style={styles.pageContainer}>
            {/* Left container: Course grades */}
            <div style={styles.leftContainer}>
                <h1>Course Grades</h1>
                <CourseGradesDisplay token={token} />
            </div>

            {/* Middle container: Assignment grades */}
            <div style={styles.middleContainer}>
                <h1>Assignment Grades</h1>
                <GradesDisplay token={token} onGradeSelect={handleGradeSelection} />
            </div>

            {/* Right container: GIF based on selected grade */}
            <div style={styles.rightContainer}>
                {selectedGrade ? (
                    <img
                        src={getGifForGrade(selectedGrade.grade)}
                        alt={`Grade ${selectedGrade.grade} gif`}
                        style={styles.gif}
                    />
                ) : (
                    <p>Select a grade to see the GIF</p>
                )}
            </div>
        </div>
    );
};

const getGifForGrade = (grade) => {
    const gifs = {
        'A': 'https://media.tenor.com/EmZ0N3llkAkAAAAM/cat-cats.gif',
        'B': 'https://media.tenor.com/v3DAIe73r00AAAAM/happy-cat-smile-cat.gif',
        'C': 'https://media.tenor.com/hnH5r-jI1M8AAAAM/pipa-cat-pipa.gif',
        'D': 'https://i.pinimg.com/originals/d9/df/92/d9df9239a488ae9f2f5efd5f0b56af5e.gif',
        'F': 'https://media1.tenor.com/images/9413ffc5a11722a3cc456a88810750bd/tenor.gif?itemid=14193216',
    };

    return gifs[grade] || 'https://example.com/default-gif.gif';
};

const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '100vh',
        padding: '20px',
        gap: '20px',
    },
    leftContainer: {
        flex: 1,
        borderRight: '1px solid #ccc',
        padding: '20px',
        overflowY: 'auto',
    },
    middleContainer: {
        flex: 1,
        borderRight: '1px solid #ccc',
        padding: '20px',
        overflowY: 'auto',
    },
    rightContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center', // Centers horizontally
        alignItems: 'center',    // Centers vertically
        height: '100%',          // Ensures the container fills its parent height
        padding: '20px',
        textAlign: 'center',
    },
    gif: {
        width: '300px',
        height: 'auto',
    },
}

export default GradeReviewPage;
