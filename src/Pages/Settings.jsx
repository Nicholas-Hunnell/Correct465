import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [editableUser, setEditableUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showGifEditor, setShowGifEditor] = useState(false);
    const [gifInputs, setGifInputs] = useState({ A: '', B: '', C: '', D: '', F: '' });

    const userId = localStorage.getItem('userId');
    console.log("Retrieved userId:", userId);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const response = await fetch(`http://127.0.0.1:3003/user/get_user_by_ID?id=${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }

                    const data = await response.json();
                    setEditableUser(data.user);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableUser({
            ...editableUser,
            [name]: value,
        });
    };

    const handleGifInputChange = (e) => {
        const { name, value } = e.target;
        setGifInputs({
            ...gifInputs,
            [name]: value,
        });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setShowGifEditor(false); // Close dropdown when exiting edit mode
        }
    };

    const handleSave = async () => {
        try {
            // Save user data
            const userResponse = await fetch('http://127.0.0.1:3003/user/modify_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    ...editableUser,
                }),
            });

            if (!userResponse.ok) {
                throw new Error('Failed to save user information');
            }

            // Save GIF inputs
            const gifResponse = await fetch('http://127.0.0.1:3006/photo/updateGifs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    newGifs: gifInputs,
                }),
            });

            if (!gifResponse.ok) {
                throw new Error('Failed to save GIFs');
            }

            setIsEditing(false);
            alert('User information and GIFs saved!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        }
    };

    if (!userId) {
        return <p>Please log in to access the settings.</p>;
    }

    if (!editableUser) {
        return <p>Loading...</p>;
    }

    return (
        <div
            style={{
                backgroundColor: '#87CEEB',
                padding: '20px',
                borderRadius: '12px',
                maxWidth: '600px',
                margin: '50px auto',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <h1 style={{ color: '#1c1c1c' }}>Settings</h1>
            <div
                style={{
                    backgroundColor: '#1c1c1c',
                    padding: '40px',
                    borderRadius: '8px',
                    color: '#a3c9f1',
                }}
            >
                <label style={{display: 'block', marginBottom: '10px'}}>
                    First Name:
                    <input
                        type="text"
                        name="FirstName"
                        value={editableUser.FirstName || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #333',
                            backgroundColor: isEditing ? '#2b2b2b' : '#1c1c1c',
                            color: '#a3c9f1',
                            outline: 'none',
                            marginTop: '5px',
                        }}
                    />
                </label>

                <label style={{display: 'block', marginBottom: '10px'}}>
                    Last Name:
                    <input
                        type="text"
                        name="LastName"
                        value={editableUser.LastName || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #333',
                            backgroundColor: isEditing ? '#2b2b2b' : '#1c1c1c',
                            color: '#a3c9f1',
                            outline: 'none',
                            marginTop: '5px',
                        }}
                    />
                </label>
                <label style={{display: 'block', marginBottom: '10px'}}>
                    School Name:
                    <input
                        type="text"
                        name="SchoolName"
                        value={editableUser.CollegeName || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #333',
                            backgroundColor: isEditing ? '#2b2b2b' : '#1c1c1c',
                            color: '#a3c9f1',
                            outline: 'none',
                            marginTop: '5px',
                        }}
                    />
                </label>
                <label style={{display: 'block', marginBottom: '10px'}}>
                    Email:
                    <input
                        type="email"
                        name="Email"
                        value={editableUser.Email || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #333',
                            backgroundColor: isEditing ? '#2b2b2b' : '#1c1c1c',
                            color: '#a3c9f1',
                            outline: 'none',
                            marginTop: '5px',
                        }}
                    />
                </label>
                <label style={{display: 'block', marginBottom: '10px'}}>
                    Password:
                    <input
                        type="text"
                        name="password"
                        value={editableUser.Password || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #333',
                            backgroundColor: isEditing ? '#2b2b2b' : '#1c1c1c',
                            color: '#a3c9f1',
                            outline: 'none',
                            marginTop: '5px',
                        }}
                    />
                </label>

                <label style={{display: 'block', marginBottom: '10px'}}>
                    Canvas Token:
                    <input
                        type="text"
                        name="CanvasToken"
                        value={editableUser.CanvasToken || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #333',
                            backgroundColor: isEditing ? '#2b2b2b' : '#1c1c1c',
                            color: '#a3c9f1',
                            outline: 'none',
                            marginTop: '5px',
                        }}
                    />
                </label>

                <div style={{marginTop: '20px'}}>
                    <button
                        onClick={() => isEditing && setShowGifEditor(!showGifEditor)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: isEditing ? '#3a9ad9' : '#666',
                            color: '#000',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isEditing ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold',
                            marginTop: '20px',
                            transition: 'background-color 0.3s',
                        }}
                        disabled={!isEditing}
                        onMouseOver={(e) => isEditing && (e.target.style.backgroundColor = '#66b8ff')}
                        onMouseOut={(e) => isEditing && (e.target.style.backgroundColor = '#3a9ad9')}
                    >
                        Edit Cat Gifs
                    </button>
                    {showGifEditor && (
                        <div style={{marginTop: '20px'}}>
                            <p style={{marginBottom: '10px', color: '#a3c9f1'}}>
                                Paste the image/GIF URLs below. Each image/GIF will appear when you select the
                                respective grade.
                            </p>
                            {['A', 'B', 'C', 'D', 'F'].map((field) => (
                                <label key={field} style={{display: 'block', marginBottom: '10px'}}>
                                    {field}:
                                    <input
                                        type="text"
                                        name={field}
                                        value={gifInputs[field]}
                                        onChange={handleGifInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #333',
                                            backgroundColor: '#2b2b2b',
                                            color: '#a3c9f1',
                                            outline: 'none',
                                            marginTop: '5px',
                                        }}
                                    />
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleEditToggle}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3a9ad9',
                        color: '#000',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '20px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                >
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
                {isEditing && (
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#3a9ad9',
                            color: '#000',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            marginTop: '20px',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                    >
                        Save
                    </button>
                )}
            </div>
        </div>
    );
};

export default Settings;
