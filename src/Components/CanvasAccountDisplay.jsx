import React, { useEffect, useState } from 'react';

const CanvasAccountDisplays = () => {
    const [course, setCourse] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://127.0.0.1:3001/canvas/get_canvas_account_info'); // Adjust the URL if needed
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCourse(data.grades || []); // Ensure it defaults to an empty arraya
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <p>Loading grades...</p>;
    }

    if (error) {
        return <p>Error fetching grades: {error}</p>;
    }

    return (
        <div>
            <h2>Student Grades</h2>
            <ul>
                {course.map((course, index) => (
                    <li key={index}>{course}</li>
                ))}
            </ul>
        </div>
    );
};

export default CanvasAccountDisplays;
