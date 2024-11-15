import React, { useEffect, useState } from 'react';
//change
const GradeDisplay = ({ token, canvasUserId }) => {
    const [grades, setGrades] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch grades once the Canvas user ID is available
    useEffect(() => {
        if (!canvasUserId) return;  // Don't fetch grades until we have the Canvas user ID
        if (!token) {
            setError("Missing token");
            setLoading(false);
            return;
        }

        // Fetch grades using the Canvas User ID
        const fetchGrades = async () => {
            setLoading(true);
            try {
                const url = `http://127.0.0.1:3001/canvas/get_all_assignments_with_gradesOGONEnpnpm/?userId=${canvasUserId}&token=${token}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error fetching grades');
                }

                const data = await response.json();
                setGrades(data.assignments || []); // Default to empty array if no assignments
            } catch (err) {
                setError("Error fetching grades: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, [canvasUserId, token]); // Fetch grades only after Canvas User ID is set

    if (loading) {
        return <p>Loading grades...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Student Grades</h2>
            <ul>
                {grades.length === 0 ? (
                    <p>No assignments available.</p>
                ) : (
                    grades.map((grade, index) => (
                        <li key={index}>
                            {grade.courseName} - {grade.assignmentName}: {grade.grade} ({grade.score}/{grade.totalPoints})
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default GradeDisplay;
