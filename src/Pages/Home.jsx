import React from 'react';


const Home = () => {
    return (
        <div>
            <h1>My Home Screen</h1>
        <p>
            <a href="http://localhost:3002/auth/google">Connect Google Classroom Account</a>
        </p>
        <p>
            <a href="http://localhost:3001/auth/canvase">Connect Canvas Account</a>
        </p>
        </div>
    );
};

export default Home;