// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Grades from './Pages/GradeDisplayPage.jsx'; // Assuming this is the correct path for your Grades component

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/grades">Grades</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} /> {/* Pass component as JSX */}
                <Route path="/grades" element={<Grades />} /> {/* Pass component as JSX */}
            </Routes>
        </Router>
    );
};

export default App;
