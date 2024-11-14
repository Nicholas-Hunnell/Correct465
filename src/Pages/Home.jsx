import React, {useState} from 'react';
import {useLocation, Navigate} from "react-router-dom";



const Home = () => {


    const location = useLocation();
    const data = location.state;

    if (!data || !data.user) {
        return <Navigate to="/login" replace />;
    }


    const loggedInUser = data.user;
    //This ensures that the user has user data before they can go to the home page



    console.log(data.user);

    var googleClassroomRedirect = "http://localhost:3002/auth/google/"+loggedInUser.id;
    console.log("USER DATA BELOW");
    console.log(data);
    console.log("USER DATA ABOVE");

    return (

        <div>
            <h1>My Home Screen</h1>
            <p>
                <a href={googleClassroomRedirect}>Connect Google Classroom Account</a>
                <br/>
                <a href="http://localhost:3000/GradeReviewPage/7097162">View Canvas Grades</a>
            </p>
        </div>

    );
};

export default Home;
//test