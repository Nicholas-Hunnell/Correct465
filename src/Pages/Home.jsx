import React from 'react';
import {useLocation} from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const data = location.state;
    const loggedInUser = data.user;


    var googleClassroomRedirect = "http://localhost:3002/auth/google/"+loggedInUser.id;

    return (
        <div>
            <h1>My Home Screen</h1>
            <p>
                <a href={googleClassroomRedirect}>Connect Google Classroom Account</a>
                <br/>
                <a href="http://localhost:3000/GradeReviewPage/">View Canvas Grades</a>
            </p>
        </div>
    );
};

export default Home;
//test