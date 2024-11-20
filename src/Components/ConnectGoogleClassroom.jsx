import React from "react";
import Button from "react-bootstrap/Button";

function TypesExample({ userId }) {
    const handleGoogleAuth = () => {
        const authUrl = `http://127.0.0.1:3002/auth/google?userId=${encodeURIComponent(userId)}`;
        window.location.href = authUrl; // Redirect the user to backend's Google OAuth endpoint
    };

    return (
        <Button onClick={handleGoogleAuth} variant="primary">
            Connect Google Classroom
        </Button>
    );
}

export default TypesExample;