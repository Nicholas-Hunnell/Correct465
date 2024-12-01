import React, { useState, useEffect } from 'react';



const GradeDisplay = ({ token, setSelectedGrade }) => { // Add setSelectedGrade as a prop

  const [grades, setGrades] = useState([]);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!token) {

      setError("Missing Canvas token. Please log in again.");

      setLoading(false);

      return;

    }

    const fetchGrades = async () => {

      setLoading(true);

      try {

        const url = `http://127.0.0.1:3001/canvas/get_all_assignments_with_gradesOGONEnpnpm/?token=${token}`;

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

        setGrades(data.assignments || []);

      } catch (err) {

        setError("Error fetching grades: " + err.message);

      } finally {

        setLoading(false);

      }

    };

    fetchGrades();

  }, [token]);

  if (loading) {

    return <p>Loading grades...</p>;

  }

  if (error) {

    return <p>{error}</p>;

  }

  const handleGradeClick = (grade) => {

    setSelectedGrade(grade); // Update the selected grade in parent state

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

                      onClick={() => handleGradeClick(grade)}
                  >
                    <strong>{grade.courseName}</strong> - {grade.assignmentName}: {grade.grade} ({grade.score}/{grade.totalPoints})
                  </div>

              ))}
            </div>

        )}
      </div>

  );

};

export default GradeDisplay;

