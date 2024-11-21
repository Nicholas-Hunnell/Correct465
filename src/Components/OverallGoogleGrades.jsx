import React, { useEffect, useState } from 'react';
import '../Pages CSS/GradeDisplay.css';
import GradeDisplay from "./GradeDisplay"; // Make sure to import the updated CSS

const OverallGoogleGrades = ({ token }) =>{
    const [grades, setGrades] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(()=>{
        if (!token) {
            setError("Missing Google token. Please log in again.");
            setLoading(false);
            return;
        }
        const fetchGrades = async () => {
            setLoading(true);
            try {
                const url = `http://localhost:3002/Gclass/get_overall_grades?googleClassroomToken=${token}`;

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
                setGrades(data || []); // Default to empty array if no assignments
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

    return (
        <div className="grades-container">
            <h2>Student Grades</h2>
            {grades.length === 0 ? (
                <p className="no-grades">No assignments available.</p>
            ) : (
                <div className="grade-list">
                    {grades.map((grade, index) => (
                        <div key={index} className="grade-item">
                            <strong>{grade.course}</strong>
                            <span>
                        <br/>
                        Overall Grade:
                        <br/>
                                {grade.overallGrade}
                    </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OverallGoogleGrades;