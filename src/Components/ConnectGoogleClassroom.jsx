import React from "react";
import Button from "react-bootstrap/Button";

function TypesExample({ userId }) {
    const handleGoogleAuth = () => {
        const authUrl = `http://127.0.0.1:3002/auth/google?userId=${encodeURIComponent(userId)}`;
        window.location.href = authUrl; // Redirect the user to backend's Google OAuth endpoint
    };

    return (

        <Button onClick={handleGoogleAuth} variant="primary"
            style={{
                display: 'inline-block',
                marginBottom: '10px',
                padding: '12px',
                textDecoration: 'none',
                color: '#000',
                backgroundColor: '#3a9ad9',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
        >
            Connect Google Classroom Account
        </Button>
    );
}

export default TypesExample;