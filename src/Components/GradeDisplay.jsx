import React, { useEffect, useState } from 'react';

const GradesDisplay = () => {
    const [grades, setGrades] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch('http://127.0.0.1:3001/canvas/get_grades'); // Adjust the URL if needed
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGrades(data.grades || []); // Ensure it defaults to an empty array
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, []);

    if (loading) {
        return <p>Loading grades...</p>;
    }

    if (error) {
        return <p>Error fetching grades: {error}</p>;
    }
//test
    return (
        <div>
            <h2>Student Grades</h2>
            <ul>
                {grades.map((grade, index) => (
                    <li key={index}>{grade}</li>
                ))}
            </ul>
        </div>
    );
};

export default GradesDisplay;
