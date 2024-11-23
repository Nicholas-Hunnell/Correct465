import React, { useEffect, useState } from 'react';
import '../Pages CSS/GradeDisplay.css';

const CourseGradesDisplay = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setError("Missing Canvas token. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchCourseGrades = async () => {
            setLoading(true);
            try {
                const url = `http://127.0.0.1:3001/canvas/get_grades?token=${token}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error fetching course grades');
                }

                const data = await response.json();
                console.log("Fetched Data:", data); // Debugging log

                // Parse the grades into objects with courseName and grade properties
                const parsedCourses = (data.grades || []).map((courseString) => {
                    const match = courseString.match(/Course:\s(.+?),\sGrades:\s(.+)/);
                    if (match) {
                        return { courseName: match[1], grade: match[2] };
                    }
                    return null; // Handle unexpected format
                }).filter(Boolean); // Remove null values

                setCourses(parsedCourses);
            } catch (err) {
                setError("Error fetching course grades: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseGrades();
    }, [token]);

    if (loading) {
        return <p>Loading course grades...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="grades-container">
            <h2>Course Grades</h2>
            {courses.length === 0 ? (
                <p className="no-grades">No courses available.</p>
            ) : (
                <div className="grade-list">
                    {courses.map((course, index) => (
                        <div key={index} className="grade-item">
                            <strong>{course.courseName}</strong>: {course.grade}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseGradesDisplay;
