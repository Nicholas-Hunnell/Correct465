import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradeDisplay_Google from '../Components/GradeDisplay_Google.jsx';
import OverallGoogleGrades from '../Components/OverallGoogleGrades.jsx';

const GradeReviewPage = () => {
    const token = localStorage.getItem('googleToken');
    const userId = localStorage.getItem('userId'); // Used for fetching user-specific GIFs

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [userGifs, setUserGifs] = useState({
        'A': 'https://media.tenor.com/EmZ0N3llkAkAAAAM/cat-cats.gif',
        'B': 'https://media.tenor.com/v3DAIe73r00AAAAM/happy-cat-smile-cat.gif',
        'C': 'https://media.tenor.com/hnH5r-jI1M8AAAAM/pipa-cat-pipa.gif',
        'D': 'https://i.pinimg.com/originals/d9/df/92/d9df9239a488ae9f2f5efd5f0b56af5e.gif',
        'F': 'https://media1.tenor.com/images/9413ffc5a11722a3cc456a88810750bd/tenor.gif?itemid=14193216',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Missing Google Token. Please log in again.');
        }
    }, [token]);

    // Pre-fetch GIF data
    useEffect(() => {
        const fetchUserGifs = async () => {
            if (userId) {
                try {
                    const response = await fetch(`http://127.0.0.1:3006/photo/getGifs?userId=${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }

                    const data = await response.json();
                    setUserGifs((prevGifs) => ({
                        ...prevGifs,
                        ...data,
                    }));
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserGifs();
    }, [userId]);

    const handleGradeSelection = (grade) => {
        setSelectedGrade(grade);
    };

    const getGifForGrade = (grade) => {
        return userGifs[grade] || 'https://example.com/default-gif.gif';
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.pageContainer}>
            {/* Far-left container with OverallGoogleGrades */}
            <div style={styles.farLeftContainer}>
                <OverallGoogleGrades token={token} />
            </div>

            {/* Middle container with grades and other components */}
            <div style={styles.leftContainer}>
                <h1>Google Classroom Grades</h1>
                <GradeDisplay_Google token={token} onGradeSelect={handleGradeSelection} />
            </div>

            {/* Right container with the gif based on the selected grade */}
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

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: '16px',
    },
    farLeftContainer: {
        flex: '0 0 150px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftContainer: {
        flex: '1',
        padding: '16px',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        flex: '1',
        padding: '16px',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gif: {
        maxWidth: '300px',
        height: 'auto',
    },
};

export default GradeReviewPage;
