import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Grades from './Pages/GradeDisplayPage.jsx';
import CreateNewAccount from './Pages/CreateNewAccount.jsx';
import LoginPage from './Pages/LoginPage.jsx'; 
import CanvasPage from './Pages/LoginPageCanvas.jsx';
import GooglePage from './Pages/LoginPageGoogle.jsx';
import AssignmentsPage from './Pages/GradeReviewPage.jsx';
const app = express()
//test


app.use(session({
    secret: 'key',  
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} /> {/* Default route for the login page */}
                <Route path="/login" element={<LoginPage />} /> {/* Route for login */}
                <Route path="/create-account" element={<CreateNewAccount />} />
                <Route path="/home" element={<Home />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/CanvasLogIn" element={<CanvasPage />} />
                <Route path = "/GoogleLogIn" element={<GooglePage />}  />
                <Route path="/GradeReviewPage/:userId" element={<AssignmentsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
