import React from 'react';
import {useLocation} from "react-router-dom";
import GradesDisplay from "../Components/GradeDisplay";
import ConnectGoogleClassroom from "../Components/ConnectGoogleClassroom";
import ViewGoogleClassroomGradesButton from "../Components/ViewGoogleClassroomGradesButton";

const Home = () => {
    const location = useLocation();
    var loggedInUser
    try{
        refreshGoogleToken();
        const data = location.state;
        loggedInUser = data.user;
    } catch (e) {
        console.log("Error: "+e.message);
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
                <br/>
                <ConnectGoogleClassroom userId={loggedInUser._id}/>
                <br/>
                <ViewGoogleClassroomGradesButton gtoken={localStorage.getItem('googleToken')}/>
            </p>
        </div>
    );
};

async function refreshGoogleToken() {
    try {
        try {
            const googleToken = localStorage.getItem("googleToken");
            const googleRefreshToken = localStorage.getItem("googleRefreshToken");
            const googleTokenExp = localStorage.getItem("googleTokenExp");

            const now = new Date();
            const timestamp = now.getTime();

            const result = await fetch(`http://localhost:3002/auth/googleRefresh?refreshToken=${encodeURIComponent(googleRefreshToken)}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            const responseData = await result.json();

            localStorage.setItem("googleToken", responseData.accessToken);
            localStorage.setItem("googleRefreshToken", responseData.refreshToken);
            localStorage.setItem("googleTokenExp", responseData.expiresIn);

        } catch (e) {
            console.log("Error whole getting 'googleToken' from storage: " + e.message);
            return 0;
        } finally {
            return 0;
        }


    } catch (e) {
        console.log("Error while regreshing google classroom token: " + e.message);
        return 0;
    } finally {
        return 0;
    }


}


export default Home;
//test