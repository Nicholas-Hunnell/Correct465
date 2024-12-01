import React, { useEffect, useState } from 'react';
import { userId, canvasToken } from './Home'; // Import userId and canvasToken from Home.jsx

const UserAwards = () => {
    const token = localStorage.getItem('canvasToken');
    const canvasId  = localStorage.getItem('canvasId');
    const [awards, setAwards] = useState([]);
    const [selectedAward, setSelectedAward] = useState(null); // Track the award selected for the popup
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch awards using the userId and canvasToken from Home.jsx
    useEffect(() => {
        if (!userId || !canvasToken) {
            setError("Missing user ID or Canvas token. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchAwards = async () => {
            setLoading(true);
            try {
                const url = `http://127.0.0.1:3005/awards/view?userId=${userId}&token=${canvasToken}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error fetching awards');
                }

                const data = await response.json();
                setAwards(data.data || []); // Default to empty array if no awards
            } catch (err) {
                setError("Error fetching awards: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAwards();
    }, []); // Runs only once after component mounts

    const handleAwardClick = (award) => {
        setSelectedAward(award); // Set the selected award for the popup
    };

    const closeModal = () => {
        setSelectedAward(null); // Close the popup by clearing the selected award
    };

    // Function to get the trophy based on the category
    const getTrophy = (category) => {
        if (category === 1) {
            return (
                <span
                    style={{
                        fontSize: '50px', // Large trophy
                        display: 'block',
                        marginBottom: '10px',
                    }}
                >
                    🏆
                </span>
            );
        } else if (category === 2) {
            return (
                <span
                    style={{
                        fontSize: '40px', // Medium trophy
                        display: 'block',
                        marginBottom: '10px',
                    }}
                >
                    🏆
                </span>
            );
        } else {
            return (
                <span
                    style={{
                        fontSize: '30px', // Small trophy
                        display: 'block',
                        marginBottom: '10px',
                    }}
                >
                    🏆
                </span>
            );
        }
    };

    if (loading) {
        return <p>Loading awards...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div
            style={{
                backgroundColor: '#87CEEB', // Sky Blue Background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                margin: 0,
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <div
                style={{
                    backgroundColor: '#1c1c1c', // Dark Gray Background
                    borderRadius: '12px',
                    padding: '40px 30px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
                    textAlign: 'center',
                    maxWidth: '600px',
                    width: '100%',
                }}
            >
                <h2 style={{ color: '#a3c9f1', marginBottom: '25px' }}>User Awards</h2>
                {awards.length === 0 ? (
                    <p style={{ color: '#fff' }}>No awards available for this user.</p>
                ) : (
                    <div>
                        {awards.map((award, index) => (
                            <div
                                key={index}
                                onClick={() => handleAwardClick(award)} // Open popup on click
                                style={{
                                    backgroundColor: '#3a9ad9',
                                    padding: '15px',
                                    margin: '10px 0',
                                    borderRadius: '5px',
                                    color: '#000',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    transition: 'background-color 0.3s',
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                                onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                            >
                                <strong>{award.course}</strong>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal for displaying the award category */}
                {selectedAward && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                        }}
                        onClick={closeModal}
                    >
                        <div
                            style={{
                                backgroundColor: '#fff',
                                padding: '20px',
                                borderRadius: '10px',
                                maxWidth: '300px', // Smaller width for compact modal
                                width: '80%', // Responsive width
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                                textAlign: 'center',
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            {getTrophy(selectedAward.category)}
                            <h3>Award Details</h3>
                            <p>
                                <strong>Course:</strong> {selectedAward.course}
                            </p>
                            <p>
                                <strong>Grade:</strong> {selectedAward.grade}
                            </p>
                            <p>
                                <strong>Award Category:</strong> {selectedAward.category}
                            </p>
                            <button
                                style={{
                                    padding: '12px',
                                    marginTop: '15px',
                                    backgroundColor: '#3a9ad9',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    transition: 'background-color 0.3s',
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                                onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAwards;
