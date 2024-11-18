import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Pages CSS/LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    localStorage.setItem('canvasId', '10500000007027479');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Handle login click event
    const handleLoginClick = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3003/user/login', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email: email, Password: password })
            });


            const data = await response.json();

            // If the login is successful
            if (response.ok) {
                // Save the token to localStorage
                localStorage.setItem('token', data.token);

                // Save user data to localStorage (excluding the password)
                localStorage.setItem('userId', data.user._id);
                localStorage.setItem('firstName', data.user.FirstName);
                localStorage.setItem('lastName', data.user.LastName);
                localStorage.setItem('collegeName', data.user.CollegeName);
                localStorage.setItem('email', data.user.Email);
                localStorage.setItem('dashboardService', data.user.DashboardService);
                localStorage.setItem('canvasToken', data.user.CanvasToken);
                localStorage.setItem('googleRefreshToken', data.user.googleRefreshToken);
                localStorage.setItem('googleToken', data.user.googleClassroomToken);
                localStorage.setItem('googleTokenExp', data.user.googleTokenExp);

                // Navigate to the home page or desired page after successful login
                navigate('/home', { state: data });

                console.log('Login successful', data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error with Login Procedure: ", error);
            alert("Error occurred with login procedure. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome Back!</h1>
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <label>
                    Email:
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="button" onClick={handleLoginClick}>
                    Login
                </button>
            </form>
            <div className="signup-link">
                <p>Don't have an account? <Link to="/create-account">Create New Account</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;
