// TextField.jsx
import React from 'react';

const TextField = ({ label, type, name, value, onChange }) => (
    <div className="form-group">
        <label>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="form-control"
            required
        />
    </div>
);

export default TextField;
//test