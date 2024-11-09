import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Pages CSS/GradeReview.css';

// Function to fetch assignments from the server
const fetchAssignments = async (userId) => {
    try {
        const response = await fetch(`http://127.0.0.1:3001/canvas/get_all_assignments_with_gradesOGONEnpnpm/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch assignments');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching assignments:', error);
        throw error;
    }
};

const AssignmentsPage = () => {
    const { userId } = useParams();
    console.log('User ID:', userId);

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAssignments = async () => {
            try {
                if (!userId) {
                    setError('Invalid User ID');
                    setLoading(false);
                    return;
                }
                const data = await fetchAssignments(userId);
                console.log('Assignments fetched:', data);
                setAssignments(data.assignments);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching assignments:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        getAssignments();
    }, [userId]);

    if (loading) {
        return <div>Loading assignments...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Assignments</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Course Name</th>
                    <th>Assignment Name</th>
                    <th>Grade</th>
                    <th>Score</th>
                    <th>Total Points</th>
                </tr>
                </thead>
                <tbody>
                {assignments.length === 0 ? (
                    <tr><td colSpan="5">No assignments found.</td></tr>
                ) : (
                    assignments.map((assignment, index) => (
                        <tr key={index}>
                            <td>{assignment.courseName || 'N/A'}</td>
                            <td>{assignment.assignmentName}</td>
                            <td>{assignment.grade}</td>
                            <td>{assignment.score !== null ? assignment.score : 'Not graded'}</td>
                            <td>{assignment.totalPoints}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentsPage;

