import React from 'react';
import { Link } from 'react-router-dom';
import '../Pages CSS/LoginPage.css';

function CanvasPage({ onLogin }) {
    const handleLoginClick = () => {
        // Simulate authentication process
        onLogin();
    };

    return (
        <div className="login-container">
            <h1>Welcome Back!</h1>
            <form className="login-form">
                <label>
                    Email:
                    <input type="email" placeholder="Enter your email" />
                </label>
                <label>
                    Password:
                    <input type="password" placeholder="Enter your password" />
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

export default CanvasPage;