import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserAwards = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = location.state || {};

    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const response = await axios.get(`/awards/view`);
                if (response.data.success) {
                    setAwards(response.data.data);
                } else {
                    setError('Failed to fetch awards: ' + response.data.message);
                }
            } catch (err) {
                setError('Error fetching awards: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAwards();
        } else {
            setError('User ID is missing.');
            setLoading(false);
        }
    }, [userId]);

    const handleBackClick = () => {
        navigate('/'); // Navigate back to the home page
    };

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
                    maxWidth: '800px',
                    width: '100%',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ color: '#a3c9f1', marginBottom: '25px' }}>User Awards</h1>
                    <button
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#3a9ad9',
                            color: '#000',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                        onClick={handleBackClick}
                    >
                        Back
                    </button>
                </div>

                {/* Content */}
                <div style={{ marginTop: '20px' }}>
                    {loading ? (
                        <p style={{ color: '#a3c9f1' }}>Loading...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>{error}</p>
                    ) : awards.length > 0 ? (
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                marginTop: '20px',
                                color: '#fff',
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Course</th>
                                    <th style={tableHeaderStyle}>Grade</th>
                                    <th style={tableHeaderStyle}>Award Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {awards.map((award, index) => (
                                    <tr key={index}>
                                        <td style={tableCellStyle}>{award.course}</td>
                                        <td style={tableCellStyle}>{award.grade}</td>
                                        <td style={tableCellStyle}>{award.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ color: '#a3c9f1' }}>No awards found for this user.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Inline styles for the table
const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#3a9ad9',
    color: '#000',
    fontWeight: 'bold',
};

const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#1c1c1c',
    color: '#a3c9f1',
};

export default UserAwards;
