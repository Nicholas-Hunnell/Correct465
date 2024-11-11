// RadioGroup.jsx
import React from 'react';

const RadioGroup = ({ label, name, options, value, onChange }) => (
    <div className="form-group">
        <label>{label}</label>
        <div>
            {options.map((option) => (
                <div key={option.value} className="form-check form-check-inline">
                    <input
                        type="radio"
                        id={`${name}-${option.value}`}
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={onChange}
                        className="form-check-input"
                    />
                    <label htmlFor={`${name}-${option.value}`} className="form-check-label">
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    </div>
);

export default RadioGroup;
//test