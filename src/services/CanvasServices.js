const express = require("express");
const {MongoClient} = require("mongodb");
const cors = require('cors')
const app = express();
const https = require("https");
const port = 3001;
const hostname = '127.0.0.1';

//frontend connection
const corsOptions = {
    origin: 'http://localhost:3000'
};
app.use(cors(corsOptions))

//mongo connection
const uri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

//local variables
const canvasHost = 'psu.instructure.com';
const token = '1050~VfGck36h7t3YHBfLx8nmWDQKJEzN4Yukn3KfNYh68eYDvzVGWe6aVfCxJYZ4E8DX'; //this is the user generated token

// Start the Express server
app.listen(port, hostname, () => {
    console.log(`Canvas services server running at http://${hostname}:${port}/`);
});


////////////////////////////////////////////   CANVAS   ///////////////////////////////////////////

app.get('/canvas/get_all_class_names', (req, res) => {

    const options = {
        hostname: canvasHost,
        port: 443,
        path: '/api/v1/users/self/favorites/courses?enrollment_state=active',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json+canvas-string-ids'
        }
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });
        console.log("debug1");
        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const courses = JSON.parse(data);

                if (Array.isArray(courses)) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('<html><body><p>Student Courses:</p><ul>');

                    courses.forEach(course => {
                        if (course.name) {
                            res.write(`<li>${course.name}</li>`);
                        } else {
                            res.write(`<li>Course ID: ${course.id} has no name available.</li>`);
                        }
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
        res.status(500).json({
            message: 'Error connecting to Canvas API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
});

app.get('/canvas/get_all_course_ids', (req, res) => {

    const options = {
        hostname: canvasHost,
        port: 443,
        path: '/api/v1/users/self/favorites/courses?enrollment_state=active',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json+canvas-string-ids'
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

                if (Array.isArray(courses)) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('<html><body><p>Student Courses:</p><ul>');

                    courses.forEach(course => {
                        if (course.name) {
                            res.write(`<li>${course.id}</li>`);
                        } else {
                            res.write(`<li>Course ID: ${course.id} has no name available.</li>`);
                        }
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
        res.status(500).json({
            message: 'Error connecting to Canvas API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
});

app.get('/canvas/get_grades', (req, res) => {
    const options = {
        hostname: canvasHost,
        port: 443,
        path: '/api/v1/users/self/favorites/courses',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json+canvas-string-ids'
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

                if (Array.isArray(courses) && courses.length > 0) {
                    // Create an array to hold all the promises for fetching enrollments
                    const enrollmentPromises = courses.map(course => {
                        return new Promise((resolve, reject) => {
                            const enrollmentOptions = {
                                hostname: canvasHost,
                                port: 443,
                                path: `/api/v1/courses/${course.id}/enrollments?user_id=self`,
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Accept': 'application/json+canvas-string-ids'
                                }
                            };


                            const enrollmentRequest = https.request(enrollmentOptions, enrollmentResponse => {
                                let enrollmentData = '';

                                enrollmentResponse.on('data', chunk => {
                                    enrollmentData += chunk;
                                });

                                enrollmentResponse.on('end', () => {
                                    const enrollments = JSON.parse(enrollmentData);
                                    let gradeInfo = `Course: ${course.name}, Grades: `;

                                    if (enrollments.length > 0) {
                                        enrollments.forEach(enrollment => {
                                            if (enrollment.grades && enrollment.grades.current_grade) {
                                                gradeInfo += `${enrollment.grades.current_grade} `;
                                            } else {
                                                gradeInfo += 'No grade available ';
                                            }
                                        });
                                    } else {
                                        gradeInfo += 'No enrollments found';
                                    }
                                    resolve(gradeInfo);
                                });
                            });

                            enrollmentRequest.on('error', error => {
                                reject(`Error retrieving enrollments for course: ${error.message}`);
                            });

                            enrollmentRequest.end();
                        });
                    });

                    // Wait for all enrollment promises to resolve
                    Promise.all(enrollmentPromises)
                        .then(results => {
                            res.json({
                                grades: results
                            });
                        })
                        .catch(error => {
                            res.status(500).json({
                                message: 'Error retrieving enrollments',
                                error: error
                            });
                        });

                } else {
                    res.json({
                        message: 'No favorite courses found'
                    });
                }
            } else {
                res.status(apiResponse.statusCode).json({
                    message: 'Error retrieving favorite courses',
                    status: apiResponse.statusCode,
                    error: data
                });
            }

        });
    });

    apiRequest.on('error', error => {
        res.status(500).json({
            message: 'Error connecting to Canvas API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
});



//QUIZES
app.get('/canvas/get_assignments/:userId/:courseId', (req, res) => {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    const options = {
        hostname: canvasHost,
        port: 443,
        path: `/api/v1/users/${userId}/courses/${courseId}/assignments`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json+canvas-string-ids'
        }
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const assignments = JSON.parse(data);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<html><body><p>Assignments:</p><ul>');

                assignments.forEach(assignment => {
                    res.write(`<li>Assignment ID: ${assignment.id}, Name: ${assignment.name}, Due Date: ${assignment.due_at || 'Not set'}</li>`);
                });

                res.write('</ul></body></html>');
                res.end();
            } else {
                res.status(apiResponse.statusCode).json({
                    message: 'Error retrieving assignments',
                    status: apiResponse.statusCode,
                    error: data
                });
            }
        });
    });

    apiRequest.on('error', error => {
        res.status(500).json({
            message: 'Error connecting to Canvas API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
});
//QUIZESS AND GRADES
app.get('/canvas/get_assignments/:userId/:courseId/grades', (req, res) => {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    const options = {
        hostname: canvasHost,
        port: 443,
        path: `/api/v1/users/${userId}/courses/${courseId}/assignments?include[]=submission&include[]=grading`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json+canvas-string-ids'
        }
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const assignments = JSON.parse(data);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<html><body><p>Assignments with Letter Grades:</p><ul>');

                assignments.forEach(assignment => {
                    const submission = assignment.submission;
                    const totalPoints = assignment.points_possible || 0;
                    const score = submission ? submission.score : 0;

                    let letterGrade = 'Not graded';
                    if (totalPoints > 0 && submission) {
                        const percentage = (score / totalPoints) * 100;
                        letterGrade = getLetterGrade(percentage);
                    }

                    res.write(`<li>Assignment ID: ${assignment.id}, Name: ${assignment.name}, Due Date: ${assignment.due_at || 'Not set'}, Letter Grade: ${letterGrade}</li>`);
                });

                res.write('</ul></body></html>');
                res.end();
            } else {
                res.status(apiResponse.statusCode).json({
                    message: 'Error retrieving assignments',
                    status: apiResponse.statusCode,
                    error: data
                });
            }
        });
    });

    apiRequest.on('error', error => {
        res.status(500).json({
            message: 'Error connecting to Canvas API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
});

// Helper function to convert percentage to letter grade
function getLetterGrade(percentage) {
    if (percentage >= 90) {
        return 'A';
    } else if (percentage >= 80) {
        return 'B';
    } else if (percentage >= 70) {
        return 'C';
    } else if (percentage >= 60) {
        return 'D';
    } else {
        return 'F';
    }
}
//NOT ALLOWED USER DOES NOT HAVE PERMISSIONS
const { format, subMonths } = require('date-fns');
app.get('/canvas/get_grade_changes/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    // Calculate start time (2 months ago) and end time (now)
    const endTime = new Date();
    const startTime = subMonths(endTime, 2);

    const options = {
        hostname: canvasHost,
        port: 443,
        path: `/api/v1/audit/grade_change/students/${studentId}?start_time=${format(startTime, "yyyy-MM-dd'T'HH:mm:ss'Z'")}&end_time=${format(endTime, "yyyy-MM-dd'T'HH:mm:ss'Z'")}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const gradeChanges = JSON.parse(data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(gradeChanges));
            } else {
                res.status(apiResponse.statusCode).json({
                    message: 'Error retrieving grade changes',
                    status: apiResponse.statusCode,
                    error: data
                });
            }
        });
    });

    apiRequest.on('error', error => {
        res.status(500).json({
            message: 'Error connecting to Canvas API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
});


//Gets Canvas Account info
app.get('/canvas/get_canvas_account_info', (req, res) => {
    const options = {
        hostname: canvasHost,
        port: 443,
        path: '/api/v1/users/self',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json+canvas-string-ids'
        }
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const userInfo = JSON.parse(data);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<html><body><p>User Account Info:</p><ul>');

                // Display user information
                res.write(`<li>User ID: ${userInfo.id}</li>`);
                res.write(`<li>Name: ${userInfo.name}</li>`);
                res.write(`<li>Login ID: ${userInfo.login_id}</li>`);
                res.write(`<li>Created At: ${userInfo.created_at}</li>`);

                res.write('</ul></body></html>');
                res.end();
            } else {
                res.status(apiResponse.statusCode).json({
                    message: 'Error retrieving user info',
                    status: apiResponse.statusCode,
                    error: data
                });
            }
        });
    });

    apiRequest.on('error', error => {
        res.status(500).json({
            message: 'Error connecting to Canvas API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
});
app.get('/canvas/get_single_class', (req, res) => {
    res.status(200).json({
        message: 'Successfully called canvas/get_single_class'
    });
});

app.get('/canvas/get_all_open_assignments_for_class', (req, res) => {
    res.status(200).json({
        message: 'Successfully called canvas/get_all_open_assigments_for_class'
    });
});

app.get('/canvas/get_assignment_grade', (req, res) => {
    res.status(200).json({
        message: 'Successfully called canvas/get_assignment_grade'
    });
});

app.post('/canvas/auth/getToken', (req, res) => {
    res.status(200).json({
        message: 'Successfully called canvas/getToken'
    });
})
//ATEMPT AT ThE MEGA LOOP
app.get('/canvas/get_all_assignments_with_gradesOGONE/:userId', (req, res) => {
    const userId = req.params.userId;

    // Step 1: Get all course IDs for the user
    const courseOptions = {
        hostname: canvasHost,
        port: 443,
        path: '/api/v1/users/self/favorites/courses?enrollment_state=active',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json+canvas-string-ids'
        }
    };

    const courseRequest = https.request(courseOptions, courseResponse => {
        let courseData = '';

        courseResponse.on('data', chunk => {
            courseData += chunk;
        });

        courseResponse.on('end', () => {
            if (courseResponse.statusCode === 200) {
                const courses = JSON.parse(courseData);
                const assignmentsPromises = [];

                // Step 2: Create promises to get assignments for each course
                courses.forEach(course => {
                    if (course.id) {
                        const assignmentOptions = {
                            hostname: canvasHost,
                            port: 443,
                            path: `/api/v1/courses/${course.id}/assignments?include[]=submission&include[]=grading`,
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json+canvas-string-ids'
                            }
                        };

                        const assignmentPromise = new Promise((resolve, reject) => {
                            const assignmentRequest = https.request(assignmentOptions, assignmentResponse => {
                                let assignmentData = '';

                                assignmentResponse.on('data', chunk => {
                                    assignmentData += chunk;
                                });

                                assignmentResponse.on('end', () => {
                                    if (assignmentResponse.statusCode === 200) {
                                        resolve(JSON.parse(assignmentData));
                                    } else {
                                        reject({
                                            status: assignmentResponse.statusCode,
                                            message: 'Error retrieving assignments',
                                            error: assignmentData
                                        });
                                    }
                                });
                            });

                            assignmentRequest.on('error', error => {
                                reject({
                                    status: 500,
                                    message: 'Error connecting to Canvas API',
                                    error: error.message
                                });
                            });

                            assignmentRequest.end();
                        });

                        assignmentsPromises.push(assignmentPromise);
                    }
                });

                // Step 3: Wait for all assignment requests to complete
                Promise.all(assignmentsPromises)
                    .then(assignmentsArray => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        let html = '<html><body><p>All Assignments with Letter Grades:</p><ul>';

                        assignmentsArray.forEach(assignments => {
                            assignments.forEach(assignment => {
                                const submission = assignment.submission;
                                const totalPoints = assignment.points_possible || 0;
                                const score = submission ? submission.score : 0;

                                let letterGrade = 'Not graded';
                                if (totalPoints > 0 && submission) {
                                    const percentage = (score / totalPoints) * 100;
                                    letterGrade = getLetterGrade(percentage);
                                }
                                html += `<li><a href="#" class="assignment" data-grade="${letterGrade}">${assignment.name} (Grade ${letterGrade})</a></li>`;
                            });
                        });

                        html += '</ul></body></html>';
                        res.end(html); // End response with HTML content
                    })

                    .catch(error => {
                        res.status(error.status || 500).json({
                            message: error.message,
                            status: error.status,
                            error: error.error
                        });
                    });
            } else {
                res.status(courseResponse.statusCode).json({
                    message: 'Error retrieving courses',
                    status: courseResponse.statusCode,
                    error: courseData
                });
            }
        });
    });

    courseRequest.on('error', error => {
        res.status(500).json({
            message: 'Error connecting to Canvas API',
            error: error.message
        });
    });

    courseRequest.end(); // Close the request properly
});

