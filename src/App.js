import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Grades from './Pages/GradeDisplayPage.jsx';
import CreateNewAccount from './Pages/CreateNewAccount.jsx';
import LoginPage from './Pages/LoginPage.jsx'; 
import CanvasPage from './Pages/LoginPageCanvas.jsx';
import GooglePage from './Pages/LoginPageGoogle.jsx';
import GradeReviewPage from './Pages/GradeReviewPage.jsx';
import GradeHelpPage from './Pages/GradeHelpPage.jsx'
import Settings from "./Pages/Settings.jsx"
import GradeReviewPage_Google from "./Pages/GradeReviewPage_Google.jsx";
//import AwardPage from './Pages/Awards.jsx';
import GradeHelpPage_Google from "./Pages/GradeHelpPage_Google.jsx";
import UserAwards from './Pages/UserAwards.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} /> 
                <Route path="/login" element={<LoginPage />} /> 
                <Route path="/create-account" element={<CreateNewAccount />} />
                <Route path="/home" element={<Home />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/CanvasLogIn" element={<CanvasPage />} />
                <Route path = "/GoogleLogIn" element={<GooglePage />}  />
                <Route path="/GradeReviewPage" element={<GradeReviewPage />} />
                <Route path="/GradeHelpPage" element={<GradeHelpPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/GradeReviewPage_Google" element={<GradeReviewPage_Google/>} />
                <Route path="/GradeHelpPage_Google" element={<GradeHelpPage_Google />} />
                <Route path="/UserAwards" element={<UserAwards />} />
            </Routes>
        </Router>
    );
};

export default App;
