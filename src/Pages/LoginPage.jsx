import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Pages CSS/LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLoginClick = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3003/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email: email, Password: password })
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/home');

            } else {
                alert(data.message);
            }
        }catch (error) {
            console.error("Error with Login Procedure: ", error);
            alert("Error occured with login Procedure.  Try Again");
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
//test