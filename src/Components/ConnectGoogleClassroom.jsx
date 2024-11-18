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

/* GPT v1
import Button from 'react-bootstrap/Button';
import React, { useState } from "react";

function TypesExample({ userId }) {
    const [loading, setLoading] = useState(false); // Initial state: not loading

    const handleClick = async () => {
        setLoading(true); // Start loading
        try {
            const url = `http://127.0.0.1:3002/auth/google?userId=${encodeURIComponent(userId)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error while connecting to Google Classroom');
            }

            const data = await response.json(); // If backend sends JSON
            console.log('API Response:', data);

            // Add any further logic to handle the successful response

        } catch (err) {
            console.error("Error:", err.message);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Button onClick={handleClick} variant="primary" disabled={loading}>
                    Connect Google Classroom
                </Button>
            )}
        </div>
    );
}

export default TypesExample;

 */


/* OG
import Button from 'react-bootstrap/Button';

import React, {useEffect, useState} from "react";

function TypesExample( { userId } ) {
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const redirect = async () => {
            setLoading(true);
            try {

                const url = `http://127.0.0.1:3002/auth/google?userId=${encodeURIComponent(userId)}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Error while redirecting');
                }

            } catch (err) {
                console.log(userId);
                throw new Error("Error fetching grades: " + err.message);
            }

            if (loading) {
                return <p>Loading grades...</p>;
            }
        }
        redirect();

    }, [loading]);

    if (loading) {
        return <p>Loading grades...</p>;
    }

    return (
        <>
            <Button onClick={handleClick} variant="primary">Connect Google Classroom</Button>
        </>
    );
}

export default TypesExample;


 */