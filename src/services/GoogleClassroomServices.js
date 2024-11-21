
const express = require("express");
const {MongoClient, ObjectId} = require("mongodb");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const https = require('https');
const { OAuth2Client } = require("google-auth-library");
const react = require('react');
const { useState } = require('react');
const {Link, useNavigate} = require("react-router-dom");
const {stringify} = require("node:querystring");
const {post} = require("axios");

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

app.get('/Gclass/get_all_assignments_with_grades', async (req, res) => {
    const gtoken = decodeURIComponent(req.query.googleToken);

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

        courseResponse.on('end', async () => {
            if (courseResponse.statusCode === 200) {
                const courses = JSON.parse(courseData).courses || [];
                if (courses.length === 0) {
                    res.json({ assignments: [] });
                    return;
                }

                const assignments = [];
                let coursesProcessed = 0;

                for (const course of courses) {
                    const courseId = course.id;
                    const courseName = course.name;

                    const courseworkOptions = {
                        hostname: 'classroom.googleapis.com',
                        port: 443,
                        path: `/v1/courses/${courseId}/courseWork`,
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${gtoken}`
                        }
                    };

                    const courseworkData = await new Promise((resolve, reject) => {
                        const courseworkRequest = https.request(courseworkOptions, courseworkResponse => {
                            let courseworkData = '';

                            courseworkResponse.on('data', chunk => {
                                courseworkData += chunk;
                            });

                            courseworkResponse.on('end', () => {
                                if (courseworkResponse.statusCode === 200) {
                                    resolve(JSON.parse(courseworkData).courseWork || []);
                                } else {
                                    reject(new Error(`Error retrieving coursework for course ${courseId}`));
                                }
                            });
                        });

                        courseworkRequest.on('error', error => {
                            reject(new Error(`Error connecting to Google Classroom API for coursework: ${error.message}`));
                        });

                        courseworkRequest.end();
                    });

                    if (courseworkData.length === 0) {
                        coursesProcessed++;
                        if (coursesProcessed === courses.length) {
                            res.json({ assignments });
                        }
                        continue;
                    }

                    for (const work of courseworkData) {
                        const courseWorkId = work.id;
                        const assignmentName = work.title;
                        const maxPoints = work.maxPoints || 0;

                        const submissionData = await new Promise((resolve, reject) => {
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
                                        resolve(JSON.parse(submissionData).studentSubmissions || []);
                                    } else {
                                        reject(new Error(`Error retrieving submissions for coursework ${courseWorkId}`));
                                    }
                                });
                            });

                            submissionRequest.on('error', error => {
                                reject(new Error(`Error connecting to Google Classroom API for submissions: ${error.message}`));
                            });

                            submissionRequest.end();
                        });

                        for (const submission of submissionData) {
                            // Ensure submission has a score
                            if (submission.assignedGrade !== null) {
                                const score = submission.assignedGrade;
                                const grade = getGrade(score, maxPoints);

                                assignments.push({
                                    courseName, // Include the course name
                                    assignmentName,
                                    grade,
                                    score,
                                    totalPoints: maxPoints
                                });
                            }
                        }
                    }

                    coursesProcessed++;
                    if (coursesProcessed === courses.length) {
                        res.json({ assignments });
                    }
                }
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
    const gtoken = req.body.googleClassroomToken;
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

app.get('/Gclass/get_overall_grades', async (req, res) => {
    // Step 1: Define options for getting the list of courses
    const gtoken = req.query.googleClassroomToken;

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

app.get('/Gclass/getAssignmentLink', async (req, res) => {
    // Step 1: Get the token and assignment ID from the query parameters
    const gtoken = decodeURIComponent(req.query.googleToken); // Google token passed in URL
    const assignmentId = req.query.assignmentId; // Assignment ID passed in URL

    // Step 2: Make request to Google Classroom API to retrieve the assignment details
    const courseworkOptions = {
        hostname: 'classroom.googleapis.com',
        port: 443,
        path: `/v1/courses/courseId/courseWork/${assignmentId}`,  // Course ID should be dynamic or passed as part of the request
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
                const assignment = JSON.parse(courseworkData);

                // Step 3: Check if the assignment has a URL link
                if (assignment && assignment.link) {
                    res.json({
                        message: 'Assignment link found.',
                        assignmentLink: assignment.link.url
                    });
                } else {
                    res.status(404).json({ message: 'Assignment link not found.' });
                }
            } else {
                res.status(courseworkResponse.statusCode).json({
                    message: `Error retrieving assignment details for ID ${assignmentId}`,
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

app.get('/auth/google', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    const scopes = [
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.rosters.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.me",

    ];

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringify({
        access_type: 'offline',
        scope: scopes.join(' '),
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        state: JSON.stringify({ userId }), // Optional state to track the user
    })}`;

    res.redirect(authUrl);
});

app.get("/auth/googleCallback", async (req, res) => {
    const { code, state } = req.query;

    console.log(JSON.parse(state)?.userId);

    const userId = ObjectId.createFromHexString(JSON.parse(state)?.userId);

    if (!code) {
        return res.status(400).send("Authorization code is missing");
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const loggedInUserId = userId;

        // Store token in MongoDB
        const oldUser = await client
            .db("TeachersPet")
            .collection("Users")
            .findOne({ _id: loggedInUserId });

        if (!oldUser) {
            return res.status(404).json({
                message: "User not found in database",
            });
        }

        oldUser.googleClassroomToken = tokens.access_token;
        oldUser.googleRefreshToken = tokens.refresh_token;
        oldUser.googleTokenExp = tokens.expiresIn;

        const result = await client
            .db("TeachersPet")
            .collection("Users")
            .updateOne({ _id: loggedInUserId }, { $set: oldUser });

        if (!result.acknowledged) {
            return res.status(400).json({
                message: "Error connecting to the database",
            });
        }

        console.log(
            "Token: " + tokens.access_token + "\n" +
            "Refresh token: " + tokens.refresh_token + "\n" +
            "Expiry date: " + tokens.expiry_date
        );

        // Redirect to frontend after successful authentication
        //get the user info again from the userId:

        const frontendUrl = `http://localhost:3000/home`; // Update to match your frontend URL
        return res.redirect(
            `${frontendUrl}?success=true&user=${encodeURIComponent(
                JSON.stringify(oldUser)
            )}`
        );

    } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        return res.status(500).send("Authentication failed");
    }
});

app.post('/auth/googleRefresh', async (req, res) => {
    const refreshToken = req.query.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ error: 'refreshToken is required' });
    }

    try {
        // Make the request to Google's OAuth token endpoint
        const response = await post("https://oauth2.googleapis.com/token", {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // Extract the relevant data
        const { access_token, expires_in, refresh_token, token_type } = response.data;

        // Return the new token, refresh token, and expiration info
        console.log("Google Classroom Token Refreshed");
        res.json({
            accessToken: access_token,
            refreshToken: refresh_token || refreshToken,
            expiresIn: expires_in,
            tokenType: token_type,
        });
    } catch (error) {
        console.log("Error refreshing token:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to refresh token", details: error.response?.data || error.message });
    }
});

app.get("/auth/google/getUserAuthToken", async (req, res) => {


    const result = await client.db("TeachersPet").collection("Users").findOne({_id: ObjectId.createFromHexString(req.body.id)});

    if(!result) {
        res.status(500).json({
            message: 'Error: This user does not exist'
        });
    }
    else{
        console.log(result);
        res.json({
            access_token: result.googleClassroomToken
        });
    }

})


//Helper functions:
function getGrade (percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}
const getAssignmentLink = (gtoken, courseId, assignmentId) => {
    return new Promise((resolve, reject) => {
        const courseworkOptions = {
            hostname: 'classroom.googleapis.com',
            port: 443,
            path: `/v1/courses/${courseId}/courseWork/${assignmentId}`,
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
                    const assignment = JSON.parse(courseworkData);
                    if (assignment && assignment.link) {
                        resolve(assignment.link.url); // Resolve with the link URL
                    } else {
                        resolve(""); // If no link is found, return an empty string
                    }
                } else {
                    reject(new Error(`Error retrieving assignment link: ${courseworkData}`));
                }
            });
        });

        courseworkRequest.on('error', error => {
            reject(new Error(`Error connecting to Google Classroom API for coursework: ${error.message}`));
        });

        courseworkRequest.end();
    });
};