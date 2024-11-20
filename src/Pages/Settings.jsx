import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [editableUser, setEditableUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3003/user/modify_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    ...editableUser,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save user information');
            }

            setIsEditing(false);
            alert('User information saved!');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Failed to save user information.');
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
                    padding: '20px',
                    borderRadius: '8px',
                    color: '#a3c9f1',
                }}
            >
                <label style={{ display: 'block', marginBottom: '10px' }}>
                    Name:
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
                <label style={{ display: 'block', marginBottom: '10px' }}>
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
                <label style={{ display: 'block', marginBottom: '10px' }}>
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
                        marginRight: '10px',
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
