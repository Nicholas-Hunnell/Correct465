import React from "react";
import Button from "react-bootstrap/Button";

function TypesExample({ gtoken }) {
    const handleGoogleAuth = () => {
        const authUrl = `http://localhost:3000/GradeReviewPage_Google`;
        window.location.href = authUrl; // Redirect the user to backend's Google OAuth endpoint
    };

    return (
        <Button onClick={handleGoogleAuth} variant="primary" style={{
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
        }}>
            View Google Classroom Grades
        </Button>
    );
}

export default TypesExample;