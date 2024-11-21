import React, { useEffect, useState } from 'react';
import '../Pages CSS/GradeDisplay.css'; // Make sure to import the updated CSS

const GradeDisplay_Google = ({ token, onGradeSelect }) => {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null); // Holds the clicked grade item's data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch grades using the token
    useEffect(() => {
        if (!token) {
            setError("Missing Canvas token. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchGrades = async () => {
            setLoading(true);
            try {
                const url = `http://127.0.0.1:3002/Gclass/get_all_assignments_with_grades?googleToken=${token}`;

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
    }, [token]); // Re-run if the token changes

    if (loading) {
        return <p>Loading grades...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Handle the click event to show details
    const handleGradeClick = (grade) => {
        setSelectedGrade(grade); // Set the clicked grade's data
    };

    return (
        <div className="grades-container">
            <h2>Student Grades</h2>
            {grades.length === 0 ? (
                <p className="no-grades">No assignments available.</p>
            ) : (
                <div className="grade-list">
                    {grades.map((grade, index) => (
                        <div
                            key={index}
                            className="grade-item"
                            onClick={() => onGradeSelect(grade)} // Notify parent about grade click
                        >
                            <strong>{grade.courseName}</strong> - {grade.assignmentName}: {grade.grade} ({grade.score}/{grade.totalPoints})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GradeDisplay_Google;
