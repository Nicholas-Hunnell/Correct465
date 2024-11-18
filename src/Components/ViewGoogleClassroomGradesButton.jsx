import React from "react";
import Button from "react-bootstrap/Button";

function TypesExample({ gtoken }) {
    const handleGoogleAuth = () => {
        const authUrl = `http://localhost:3000/GradeReviewPage_Google`;
        window.location.href = authUrl; // Redirect the user to backend's Google OAuth endpoint
    };

    return (
        <Button onClick={handleGoogleAuth} variant="primary">
            View Google Classroom Grades
        </Button>
    );
}

export default TypesExample;