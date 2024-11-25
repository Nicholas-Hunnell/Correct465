import React, { useEffect, useState } from 'react';
import { userId } from './Home'; // Import userId from Home.jsx

const UserAwards = () => {
    const [awards, setAwards] = useState([]);
    const [selectedAward, setSelectedAward] = useState(null); // Track the award selected for the popup
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch awards using the userId from Home.jsx
    useEffect(() => {
        if (!userId) {
            setError("Missing user ID. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchAwards = async () => {
            setLoading(true);
            try {
                const url = `http://127.0.0.1:3005/awards/view?userId=${userId}`;
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

    // Inline CSS styles for overriding default modal styling
    const styles = {
        modalOverlay: {
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
        },
        modalContent: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '300px', // Smaller width for compact modal
            width: '80%', // Responsive width
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
        },
        closeButton: {
            padding: '8px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '15px',
            transition: 'background-color 0.3s',
        },
        closeButtonHover: {
            backgroundColor: '#0056b3',
        },
    };

    return (
        <div>
            <h2>User Awards</h2>
            {awards.length === 0 ? (
                <p>No awards available for this user.</p>
            ) : (
                <div>
                    {awards.map((award, index) => (
                        <div
                            key={index}
                            onClick={() => handleAwardClick(award)} // Open popup on click
                            style={{
                                backgroundColor: '#3a9ad9',
                                padding: '10px',
                                margin: '10px 0',
                                borderRadius: '5px',
                                color: '#fff',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <strong>{award.course}</strong> {/* Only show the course name */}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for displaying the award category */}
            {selectedAward && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div
                        style={styles.modalContent}
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
                            style={styles.closeButton}
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAwards;
