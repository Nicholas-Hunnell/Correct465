import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewGoogleClassroomGradesButton from "../Components/ViewGoogleClassroomGradesButton";

let userId = null;
let canvasToken = null;

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Moved inside the component body
    const data = location.state;
    var loggedInUser = data?.user || {}; // Use optional chaining to avoid errors if data is undefined
    userId = loggedInUser._id; // Extract and assign the user ID (from `_id` field)
    canvasToken = loggedInUser.CanvasToken; // Extract and assign the CanvasToken
    const googleClassroomRedirect = `http://localhost:3002/auth/google/${loggedInUser.id}`;

    const handleSettingsClick = () => {
        navigate('/settings');
    };
    const handleAwardsClick = () => {
        navigate('/UserAwards', { state: { userId } });
    };
    try{
        refreshGoogleToken();
        const data = location.state;
        loggedInUser = data.user;
    } catch (e) {
        console.log("Error: "+e.message);
        const queryParams = new URLSearchParams(location.search);
        const userJson = queryParams.get('user');
        loggedInUser = userJson ? JSON.parse(userJson) : {};
    }
    console.log("Logged in User:", loggedInUser);
    console.log("User ID:", userId); // Log the extracted user ID
    console.log("Canvas Token:", canvasToken); // Log the extracted CanvasToken


    return (
        <div
            style={{
                backgroundColor: '#87CEEB', // Sky Blue Background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                margin: 0,
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <div
                style={{
                    backgroundColor: '#1c1c1c', // Dark Gray Background
                    borderRadius: '12px',
                    padding: '40px 30px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
                    textAlign: 'center',
                    maxWidth: '600px',
                    width: '100%',
                }}
            >
                {/* Header with user information and settings button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ color: '#a3c9f1', marginBottom: '25px' }}>My Home Screen</h1>
                    <div>
                        <span style={{ marginRight: '15px', color: '#a3c9f1' }}></span>
                        <button
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#3a9ad9',
                                color: '#000',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                            onClick={handleSettingsClick}
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {/* Main content with navigation buttons */}
                <div style={{ marginTop: '20px' }}>
                    <p>
                        <a
                            href={googleClassroomRedirect}
                            style={{
                                display: 'inline-block',
                                marginBottom: '10px',
                                padding: '12px',
                                textDecoration: 'none',
                                color: '#000',
                                backgroundColor: '#3a9ad9',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                        >
                            Connect Google Classroom Account
                        </a>
                    </p>
                    <p>
                        <a
                            href="http://localhost:3000/GradeReviewPage/"
                            style={{
                                display: 'inline-block',
                                marginBottom: '10px',
                                padding: '12px',
                                textDecoration: 'none',
                                color: '#000',
                                backgroundColor: '#3a9ad9',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                        >
                            View Canvas Grades
                        </a>
                    </p>
                    <p>
                        <a
                            href="http://localhost:3000/GradeHelpPage/"
                            style={{
                                display: 'inline-block',
                                marginBottom: '10px',
                                padding: '12px',
                                textDecoration: 'none',
                                color: '#000',
                                backgroundColor: '#3a9ad9',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                        >
                            View Grade Help
                        </a>
                    </p>
                    <p>
                        <button
                            style={{
                                padding: '12px',
                                marginBottom: '10px',
                                backgroundColor: '#3a9ad9',
                                color: '#000',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#66b8ff')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#3a9ad9')}
                            onClick={handleAwardsClick}
                        >
                            Go to Awards Page
                        </button>
                    </p>
                    <ViewGoogleClassroomGradesButton/>
                </div>
            </div>
        </div>
    );
};

async function refreshGoogleToken() {
    try {
        try {
            const googleToken = localStorage.getItem("googleToken");
            const googleRefreshToken = localStorage.getItem("googleRefreshToken");
            const googleTokenExp = localStorage.getItem("googleTokenExp");

            const now = new Date();
            const timestamp = now.getTime();

            const result = await fetch(`http://localhost:3002/auth/googleRefresh?refreshToken=${encodeURIComponent(googleRefreshToken)}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            const responseData = await result.json();

            localStorage.setItem("googleToken", responseData.accessToken);
            localStorage.setItem("googleRefreshToken", responseData.refreshToken);
            localStorage.setItem("googleTokenExp", responseData.expiresIn);

        } catch (e) {
            console.log("Error whole getting 'googleToken' from storage: " + e.message);
            return 0;
        } finally {
            return 0;
        }


    } catch (e) {
        console.log("Error while regreshing google classroom token: " + e.message);
        return 0;
    } finally {
        return 0;
    }


}


export default Home;
export { userId, canvasToken };
