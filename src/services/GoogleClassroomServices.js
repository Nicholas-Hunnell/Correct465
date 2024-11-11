
const express = require("express");
const {MongoClient, ObjectId} = require("mongodb");
const app = express();
app.use(express.json());
const https = require('https');
const { OAuth2Client } = require("google-auth-library");
const react = require('react');
const { useState } = require('react');
const {Link, useNavigate} = require("react-router-dom");

const port = 3002;
const hostname = '127.0.0.1';

//mongo connection
const uri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
//variables for oauth
var clientId, googleClassroomSecrets, clientSecret, oAuth2Client, redirectUri;

// Start the Express server
app.listen(port, hostname, async () => {
    console.log(`Google Classroom services server running at http://${hostname}:${port}/`);

    //get the google classroom oauth info from db
    googleClassroomSecrets = await client.db("TeachersPet").collection("Secrets").findOne({service:"googleClassroom"});
    clientId = await googleClassroomSecrets.clientId;
    clientSecret = await googleClassroomSecrets.clientSecret;
    redirectUri = "http://localhost:"+port+"/auth/googleCallback"; // OAuth callback
    oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
});


//Authentication
const gtoken = "";


app.get('/Gclass/get_overall_grades', async (req, res) => {
    // Step 1: Define options for getting the list of courses
    const courseOptions = {
        hostname: 'classroom.googleapis.com',
        port: 443,
        path: '/v1/courses?courseStates=ACTIVE',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${gtoken}`
        }
    };

    const courseRequest = https.request(courseOptions, courseResponse => {
        let courseData = '';

        courseResponse.on('data', chunk => {
            courseData += chunk;
        });

        courseResponse.on('end', () => {
            if (courseResponse.statusCode === 200) {
                const courses = JSON.parse(courseData).courses || [];
                if (courses.length === 0) {
                    res.json({ message: 'No courses found.' });
                    return;
                }

                const overallGrades = [];
                let coursesProcessed = 0;

                courses.forEach(course => {
                    const courseId = course.id;
                    const courseName = course.name;

                    // Step 2: Define options for getting coursework for each course
                    const courseworkOptions = {
                        hostname: 'classroom.googleapis.com',
                        port: 443,
                        path: `/v1/courses/${courseId}/courseWork`,
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${gtoken}`
                        }
                    };

                    const courseworkRequest = https.request(courseworkOptions, courseworkResponse => {
                        let courseworkData = '';

                        courseworkResponse.on('data', chunk => {
                            courseworkData += chunk;
                        });

                        courseworkResponse.on('end', () => {
                            if (courseworkResponse.statusCode === 200) {
                                const courseWork = JSON.parse(courseworkData).courseWork || [];
                                let totalScore = 0;
                                let totalMaxPoints = 0;
                                let courseworkProcessed = 0;

                                if (courseWork.length === 0) {
                                    overallGrades.push({ course: courseName, overallGrade: 'N/A' });
                                    coursesProcessed++;
                                    if (coursesProcessed === courses.length) {
                                        res.json(overallGrades);
                                    }
                                    return;
                                }

                                courseWork.forEach(work => {
                                    const courseWorkId = work.id;
                                    const maxPoints = work.maxPoints || 0;

                                    // Step 3: Define options for getting student submissions for each coursework
                                    const submissionOptions = {
                                        hostname: 'classroom.googleapis.com',
                                        port: 443,
                                        path: `/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions`,
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${gtoken}`
                                        }
                                    };

                                    const submissionRequest = https.request(submissionOptions, submissionResponse => {
                                        let submissionData = '';

                                        submissionResponse.on('data', chunk => {
                                            submissionData += chunk;
                                        });

                                        submissionResponse.on('end', () => {
                                            if (submissionResponse.statusCode === 200) {
                                                const studentSubmissions = JSON.parse(submissionData).studentSubmissions || [];

                                                studentSubmissions.forEach(submission => {
                                                    if (submission.assignedGrade !== undefined) {
                                                        totalScore += submission.assignedGrade;
                                                        totalMaxPoints += maxPoints;
                                                    }
                                                });

                                                courseworkProcessed++;
                                                if (courseworkProcessed === courseWork.length) {
                                                    const overallGrade = totalMaxPoints > 0 ? (totalScore / totalMaxPoints) * 100 : 'N/A';
                                                    overallGrades.push({ course: courseName, overallGrade: overallGrade.toFixed(2) + '%' });
                                                    coursesProcessed++;
                                                    if (coursesProcessed === courses.length) {
                                                        res.json(overallGrades);
                                                    }
                                                }
                                            } else {
                                                res.status(submissionResponse.statusCode).json({
                                                    message: `Error retrieving submissions for coursework ${courseWorkId}`,
                                                    error: submissionData
                                                });
                                            }
                                        });
                                    });

                                    submissionRequest.on('error', error => {
                                        res.status(500).json({ message: 'Error connecting to Google Classroom API for submissions', error: error.message });
                                    });

                                    submissionRequest.end();
                                });
                            } else {
                                res.status(500).json({
                                    message: `Error retrieving coursework for course ${courseId}`,
                                    error: courseworkData
                                });
                            }
                        });
                    });

                    courseworkRequest.on('error', error => {
                        res.status(500).json({ message: 'Error connecting to Google Classroom API for coursework', error: error.message });
                    });

                    courseworkRequest.end();
                });
            } else {
                res.status(courseResponse.statusCode).json({
                    message: 'Error retrieving courses',
                    error: courseData
                });
            }

        });
    });

    courseRequest.on('error', error => {
        res.status(500).json({ message: 'Error connecting to Google Classroom API for courses', error: error.message });
    });

    courseRequest.end();
});

app.get('/Gclass/get_courses', (req, res) => {
    const options = {
        hostname: 'classroom.googleapis.com',
        port: 443,
        path: '/v1/courses',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${gtoken}`
        }
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const courses = JSON.parse(data);
                res.json(courses);
            } else {
                res.status(apiResponse.statusCode).json({
                    message: 'Error retrieving courses',
                    status: apiResponse.statusCode,
                    error: data
                });
            }
        });
    });

    apiRequest.on('error', error => {
        res.status(500).json({ message: 'Error connecting to Google Classroom API', error: error.message });
    });

    apiRequest.end();
});



/*
app.get('/Gclass/get_courses', (req, res) => {
    const options = {
        hostname: 'classroom.googleapis.com',
        port: 443,
        path: '/v1/courses',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${req.query.gtoken}`
        }
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const courses = JSON.parse(data);
                if (Array.isArray(courses.courses)) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('<html><body><p>Student Courses:</p><ul>');

                    courses.courses.forEach(course => {
                        res.write(`<li>${course.name || `Course ID: ${course.id} has no name`}</li>`);
                    });

                    res.write('</ul></body></html>');
                    res.end();
                }
            } else {
                res.status(apiResponse.statusCode).json({
                    message: 'Error retrieving courses',
                    status: apiResponse.statusCode,
                    error: data
                });
            }
        });
    });

    apiRequest.on('error', error => {
        res.status(500).json({ message: 'Error connecting to Google Classroom API', error: error.message });
    });

    apiRequest.end();
});


 */
app.get('/Gclass/get_grades', async (req, res) => {
    res.status(200).json({
        message: 'Successfully Gclass/get_grades'
    });

    try {
        // Step 1: Get list of courses
        const coursesUrl = 'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE';
        const coursesData = await httpsGet(coursesUrl);
        const courses = coursesData.courses || [];

        if (courses.length === 0) {
            console.log('No courses found.');
            return;
        }

        // Step 2: For each course, get coursework and calculate grades
        for (const course of courses) {
            const courseId = course.id;
            const courseworkUrl = `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`;
            const courseworkData = await httpsGet(courseworkUrl);
            const courseWork = courseworkData.courseWork || [];

            let totalScore = 0;
            let totalMaxPoints = 0;

            // Step 3: Iterate through each coursework to get grades
            for (const work of courseWork) {
                const courseWorkId = work.id;
                const maxPoints = work.maxPoints || 0;

                const submissionsUrl = `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions`;
                const submissionsData = await httpsGet(submissionsUrl);
                const studentSubmissions = submissionsData.studentSubmissions || [];

                // Calculate total score and max points
                for (const submission of studentSubmissions) {
                    if (submission.assignedGrade !== undefined) {
                        totalScore += submission.assignedGrade;
                        totalMaxPoints += maxPoints;
                    }
                }
            }

            // Calculate and display the overall grade
            const overallGrade = totalMaxPoints > 0 ? (totalScore / totalMaxPoints) * 100 : null;
            console.log(`Course: ${course.name}, Overall Grade: ${overallGrade ? overallGrade.toFixed(2) + '%' : 'N/A'}`);
        }
    } catch (error) {
        console.error('Error retrieving grades:', error);
    }

});

app.get('/Gclass/get_account_info', (req, res) => {
    res.status(200).json({
        message: 'Successfully called Gclass/get_account_info'
    });
});

app.get('/Gclass/get_user_profile', (req, res) => {
    res.status(200).json({
        message: 'Successfully called Gclass/get_user_profile'
    });
});

app.get('/Gclass/login', (req, res) => {
    const options = {
        hostname: '127.0.0.1',
        port: port,
        path: '/auth/google',
        method: 'GET',
        headers: {}
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const user = {
                    _id: ObjectId.createFromHexString(req.body.userId)
                };

                const result = client.db("TeachersPet").collection("tokens").insertOne(user);
                res.write('<html><body><p>Authorized!! Your token is in the database.</p></body></html>')
                res.end();
            } else {
                res.status(apiResponse.statusCode).json({
                    message: 'Error during google authentication process',
                    status: apiResponse.statusCode,
                    error: data
                });
            }
        });
    });

    apiRequest.on('error', error => {
        res.status(500).json({
            message: 'Error connecting to Google Classroom API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
})


var loggedInUser = "";
app.get("/auth/google/:userId", async (req, res) => {
    loggedInUser = req.params.userId;

    const scopes = [
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.rosters.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.students.readonly"
    ];

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline", // Allows refresh token
        scope: scopes,
    });

    res.redirect(authUrl);
})



app.get("/auth/googleCallback", async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send("Authorization code is missing");
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        var loggedInUserId = await ObjectId.createFromHexString(loggedInUser);
        // Store token in MongoDB
        const oldUser = await client.db("TeachersPet").collection("Users").findOne({_id: loggedInUserId});
        console.log(oldUser)
        oldUser.googleClassroomToken = tokens.access_token;

        const result = await client.db("TeachersPet").collection("Users").updateOne({_id: loggedInUserId}, { $set: oldUser});
        if(!result) {
            res.status(400).json({
                message: 'Error connecting to the database'
            })
        }
        console.log(
            "Token: "+tokens.access_token+"\n"+
            "Refresh token: "+tokens.refresh_token+"\n"+
            "Expiry date: "+tokens.expiry_date
        )
        const navigate = useNavigate();
        navigate('/home', {state: {user: oldUser}});
        res.status(200).send("Authentication successfull");

    } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        res.status(500).send("Authentication failed");
    }
});

app.get("/auth/google/getUserAuthToken", async (req, res) => {
    const userId = await ObjectId.createFromHexString(req.body.id);
    const result = await client.db("TeachersPet").collection("tokens").findOne({_id: userId});

    if(!result) {
        res.status(500).json({
            message: 'Error: No token could be found for that user.'
        });
    }
    else{
        console.log(result);
        res.json({
            access_token: result.access_token
        });
    }

})

async function checkAuth(){



}

//test