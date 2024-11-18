import React from 'react';
import {useLocation} from "react-router-dom";
import GradesDisplay from "../Components/GradeDisplay";
import ConnectGoogleClassroom from "../Components/ConnectGoogleClassroom";

const Home = () => {
    const location = useLocation();
    var loggedInUser
    try{
        const data = location.state;
        loggedInUser = data.user;
    } catch (e) {
        const queryParams = new URLSearchParams(location.search);
        const userJson = queryParams.get('user');
        loggedInUser = userJson ? JSON.parse(userJson) : {};
    }
    console.log(loggedInUser);



    var googleClassroomRedirect = "http://localhost:3002/auth/google";

    return (
        <div>
            <h1>My Home Screen</h1>
            <p>
                <a href={googleClassroomRedirect}>Connect Google Classroom Account</a>
                <br/>
                <a href="http://localhost:3000/GradeReviewPage/">View Canvas Grades</a>
                <br/>
                <a href="http://localhost:3000/GradeHelpPage/">View Grade Help</a>
                <ConnectGoogleClassroom userId = {loggedInUser._id} />
            </p>
        </div>
    );
};




export default Home;
//test