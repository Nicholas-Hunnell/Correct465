import React, { useState } from 'react';
import '../Pages CSS/CreateNewAccount.css'; // Add this CSS file for custom styles if needed
import { useNavigate } from 'react-router-dom';

function CreateNewAccount() {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        CollegeName: '',
        Email: '',
        Password: '',
        DashboardService: '' // New field for education dashboard service
    });
    const navigate = useNavigate(); 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:3003/user/create_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'mode': 'no-cors'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                navigate('/login');
            } else {
                alert(result.message || 'Failed to create an account');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating an account. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <h1>Create New Account</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="FirstName"
                        placeholder="Enter your first name"
                        value={formData.FirstName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="LastName"
                        placeholder="Enter your last name"
                        value={formData.LastName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    College:
                    <input
                        type="text"
                        name="CollegeName"
                        placeholder="Enter your college"
                        value={formData.CollegeName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="Email"
                        placeholder="Enter your email"
                        value={formData.Email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="Password"
                        placeholder="Enter your password"
                        value={formData.Password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Education Dashboard Service:
                    <select
                        name="DashboardService"
                        value={formData.DashboardService}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a service</option>
                        <option value="Canvas">Canvas</option>
                        <option value="Google Classroom">Google Classroom</option>
                    </select>
                </label>
                <button type="submit">Sign Up</button>
            </form>
            <div className="login-link">
                <p>Already registered? <a href="/login">Log in here</a></p>
            </div>
        </div>
    );
}

export default CreateNewAccount;
//test