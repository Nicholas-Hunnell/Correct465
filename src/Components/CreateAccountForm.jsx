// CreateAccountForm.jsx
import React, { useState } from 'react';
import TextField from './TextField';
import RadioGroup from './RadioGroup';

const CreateAccountForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        college: '',
        educationalService: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission, e.g., call an API to create an account
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
            />
            <TextField
                label="College"
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
            />
            <RadioGroup
                label="Educational Service"
                name="educationalService"
                options={[
                    { label: 'Canvas', value: 'canvas' },
                    { label: 'Google Classroom', value: 'google_classroom' },
                ]}
                value={formData.educationalService}
                onChange={handleChange}
            />
            <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
    );
};
//test
export default CreateAccountForm;
