import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewGoogleClassroomGradesButton from "../Components/ViewGoogleClassroomGradesButton";
import ConnectGoogleClassroom from "../Components/ConnectGoogleClassroom.jsx";

let userId = null;
let canvasToken = null;

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const data = location.state;
    let loggedInUser = data?.user || {};
    userId = loggedInUser._id;
    canvasToken = loggedInUser.CanvasToken || localStorage.getItem('canvasToken');
    const googleClassroomRedirect = `http://localhost:3002/auth/google/${loggedInUser.id}`;

    const handleSettingsClick = () => navigate('/settings');
    const handleAwardsClick = () => navigate('/UserAwards', { state: { userId } });

    useEffect(() => {
        const fetchCourseGrades = async () => {
            setLoading(true);
            try {
                const url = `http://127.0.0.1:3001/canvas/get_grades?token=${canvasToken}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${canvasToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error fetching course grades');
                }

                const data = await response.json();

                const parsedCourses = (data.grades || []).map((courseString) => {
                    const match = courseString.match(/Course:\s(.+?),\sGrades:\s(.+)/);
                    if (match) {
                        return { courseName: match[1], grade: match[2] };
                    }
                    return null;
                }).filter(Boolean);

                setGrades(parsedCourses);
            } catch (err) {
                setError("Error fetching course grades: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseGrades();
    }, [canvasToken]);

    // Inject CSS for scrolling animation
    useEffect(() => {
        const scrollAnimation = `
        @keyframes scroll {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(-100%);
          }
        }
        `;
        const style = document.createElement("style");
        style.innerHTML = scrollAnimation;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Inject CSS for scaling and color-changing animation of "GRADES ARE FUN"
    useEffect(() => {
        const scaleTextAnimation = `
            @keyframes scaleText {
                0% {
                    transform: rotate(-15deg) scale(1);
                    color: hsl(0, 100%, 50%);
                }
                25% {
                    transform: rotate(-15deg) scale(1.2);
                    color: hsl(90, 100%, 50%);
                }
                50% {
                    transform: rotate(-15deg) scale(1);
                    color: hsl(180, 100%, 50%);
                }
                75% {
                    transform: rotate(-15deg) scale(1.2);
                    color: hsl(270, 100%, 50%);
                }
                100% {
                    transform: rotate(-15deg) scale(1);
                    color: hsl(360, 100%, 50%);
                }
            }
        `;
        const style = document.createElement("style");
        style.innerHTML = scaleTextAnimation;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div
            style={{
                backgroundColor: '#87CEEB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                margin: 0,
                fontFamily: 'Arial, sans-serif',
            }}
        >
            {/* Title Section */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <h1 style={{ color: '#1c1c1c', fontSize: '2.5rem', margin: 0 }}>Teacher's Pet</h1>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#1c1c1c',
                borderRadius: '12px',
                padding: '10px 20px',
                marginBottom: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}>
                <ConnectGoogleClassroom userId = {userId} />
                <a href="http://localhost:3000/GradeReviewPage/" style={buttonStyle}>View Canvas Grades</a>
                <a href="http://localhost:3000/GradeHelpPage/" style={buttonStyle}>View Grade Help</a>
                <button style={buttonStyle} onClick={handleAwardsClick}>Go to Awards Page</button>
                <ViewGoogleClassroomGradesButton />
                <button style={buttonStyle} onClick={handleSettingsClick}>
                    Settings
                </button>
            </div>

            {/* Moving Grades Ticker */}
            <div style={tickerStyle}>
                {loading ? (
                    <p style={{ color: '#fff' }}>Loading grades...</p>
                ) : error ? (
                    <p style={{ color: '#f00' }}>{error}</p>
                ) : (
                    <div style={tickerInnerStyle}>
                        {grades.map((course, index) => (
                            <span key={index} style={tickerItemStyle}>
                                {course.courseName}: {course.grade}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Image with Arched Text and Text Bubble */}
            <div style={imageContainerStyle}>
                <img
                    src="https://www.clker.com/cliparts/8/6/d/9/1220545662890146AJ_Apple_Worm.svg"
                    alt="Apple Worm"
                    style={imageStyle}
                />
                {/* Arched text */}
                <div style={archedTextStyle}>
                    GRADES ARE FUN
                </div>
                {/* Text bubble */}
                <div style={bubbleStyle}>
                    Welcome Back To Teacher's Pet!
                    <div style={bubbleTailStyle}></div> {/* Tail of the bubble */}
                </div>
            </div>
        </div>
    );
};

// Styles
const buttonStyle = {
    display: 'inline-block',
    margin: '0 10px',
    padding: '10px 20px',
    textDecoration: 'none',
    color: '#000',
    backgroundColor: '#3a9ad9',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
};

const tickerStyle = {
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px 0',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
};

const tickerInnerStyle = {
    display: 'inline-block',
    animation: 'scroll 30s linear infinite',
};

const tickerItemStyle = {
    display: 'inline-block',
    margin: '0 10px',
};

const imageContainerStyle = {
    position: 'absolute',
    bottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const imageStyle = {
    width: '250px',  // Increased the size of the image
    height: '250px', // Increased the size of the image
};

const bubbleStyle = {
    position: 'absolute',
    top: '-120px',  // Raised the bubble higher above the worm
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '15px',
    padding: '10px 20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    fontSize: '1rem',
    textAlign: 'center',
    transform: 'translateX(-50%)',
    left: '50%',
    maxWidth: '300px', // Optional: limit width for better readability
};

const bubbleTailStyle = {
    position: 'absolute',
    width: '0',
    height: '0',
    bottom: '-10px', // Position the tail below the bubble
    left: '50%',
    transform: 'translateX(-50%)',
    borderStyle: 'solid',
    borderWidth: '10px 10px 0 10px',
    borderColor: '#fff transparent transparent transparent', // Matches bubble background
};

// New style for the arched text with animation
const archedTextStyle = {
    position: 'absolute',
    top: '-180px',  // Position the text above the image
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    transform: 'rotate(-15deg)',  // Apply rotation for the arch
    transformOrigin: 'center',
    textAlign: 'center',
    animation: 'scaleText 1s ease-in-out infinite',  // Apply animation
};

export default Home;
export { userId, canvasToken };
