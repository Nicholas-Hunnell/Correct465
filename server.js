const express = require('express');
const {MongoClient} = require("mongodb");
const axios = require('axios');
const app = express();
app.use(express.json());
const cors = require('cors')
const port = 5000;
const hostname = '127.0.0.1';
const OpenAI = require("openai");

const apiKey = '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';

const openai = new OpenAI({
    apiKey: apiKey,
});


//MongoDB Connectionp
const uri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

//Token for Ben Harmon to serve as a temporary test for API calls
//collin token: 1050~VfGck36h7t3YHBfLx8nmWDQKJEzN4Yukn3KfNYh68eYDvzVGWe6aVfCxJYZ4E8DX
const token = '1050~VfGck36h7t3YHBfLx8nmWDQKJEzN4Yukn3KfNYh68eYDvzVGWe6aVfCxJYZ4E8DX'
const gtoken = 'ya29.a0AeDClZDEh7xcBKO_A5YW1C4IxQ6B_gCrEq0LYyz4beBwPyhpdm5vCJHu3h2wVaUlIgkQNUuEhr1dDgRLXFISL_p68IneGSKkuzXmEGWln3P7NwiEUB8PyUPQZXdHJGji0YQwqmgGIq9ECA1owr3VpUCHS4IiW6LUoO20L8tzaCgYKAVQSARESFQHGX2MiMHAjd17tYOMxykOBNF5ghQ0175';
const canvasHost = 'psu.instructure.com';
const https = require('https');


app.use(cors());
//////////////////////////////////////////////   User Accounts   //////////////////////////////////////
//app.use(express.json({limit: '10kb'}));

const userid = '7097162';
const courseid = '2344966';

// Spawn google classroom service
const { spawn } = require('child_process');

const googleClassroom = spawn('node', ['./src/services/GoogleClassroomServices.js'], {
    stdio: 'inherit' // Inherit the parent's stdio
});
const canvas = spawn('node', ['./src/services/CanvasServices.js'], {
    stdio: 'inherit' // Inherit the parent's stdio
});
const user = spawn('node', ['./src/services/UserServices.js'], {
    stdio: 'inherit' // Inherit the parent's stdio
});
const GradeHelp = spawn('node', ['./src/services/GradeHelpServices.js'], {
    stdio: 'inherit' // Inherit the parent's stdio
});

//// OLD HOME PAGE
/*
app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(
        '<html>' +
        '<body>' +
        'Yipee, you\'re home!\n' +
        '<p>'+
        '<a href="http://127.0.0.1:3000/canvas/get_all_class_names">'+
        '\nget_all_class_names'+
        '</a>'+
        '<\p>'+
        '<p>'+
        '<a href="http://127.0.0.1:3000/canvas/get_canvas_account_info">'+
        '\nget_canvas_account_info'+
        '</a>'+
        '<\p>'+
        '<p>'+
        '<a href="http://127.0.0.1:3000/canvas/get_assignments/' + userid + '/' + courseid + '">'+
        '\nget_canvas_quizzes'+
        '</a>'+
        '<\p>'+
        '<p>'+
        '<a href="http://127.0.0.1:3000/canvas/get_assignments/' + userid + '/' + courseid + '/grades">'+
        '\nget_canvas_quizzes_with_grades'+
        '</a>'+
        '<\p>'+
        '<p>'+
        '<a href="http://127.0.0.1:3000/canvas/get_grades">'+
        '\nget_course_grades'+
        '</a>'+
        '<\p>'+
        '<p>'+
        '<a href="http://127.0.0.1:3000/canvas/get_all_class_names">'+
        '\nget_all_class_names'+
        '</a>'+
        '<a href="http://127.0.0.1:3002/Gclass/get_courses">'+
        '\nGclass_get_courses'+
        '</a>'+
        '<\p>'+
        '<p>'+
        '<a href="http://127.0.0.1:3000/canvas/get_all_course_ids">'+
        '\nget_all_course_ids'+
        '</a>'+
        '<\p>'+
        '<p>'+
        '<a href="http://127.0.0.1:3000/canvas/get_all_assignments_with_grades/' + userid + '" > ' +
        '\nget_all_assignments_and_grades'+
        '</a>'+
        '<\p>'+
        '</body>' +
        '</html>'
    );
    res.end();
});

 */

app.post('/user/create_user', async (req, res) => {

    //check if the email is already in use
    const emailTaken = await client.db("TeachersPet").collection("Users").findOne({Email: req.body.Email})

    if (emailTaken) {
        res.status(201).json({
            message: 'Error: email ' + req.body.Email + " is already in use."
        });
    } else {
        const user = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            CollegeName: req.body.CollegeName,
            Email: req.body.Email,
            Password:req.body.Password,
            DashboardService: req.body.DashboardService
        };

        const result = client.db("TeachersPet").collection("Users").insertOne(user);
        res.status(201).json({
            message: 'Successfully called user/create_user\nFirstName ' + user.FirstName + '\n' + 'Using ' + user.DashboardService
        });
    }
});

app.post('/user/modify_user', (req, res) => {
    res.status(201).json({
        message: 'Successfully called user/modify_user'
    });
});

app.delete('/user/delete_user', async (req, res) => {
    const result = await client.db("TeachersPet").collection("Users").findOne({"Email": req.body.Email});

    if (result) {
        const result = await client.db("TeachersPet").collection("Users").deleteOne({"Email": req.body.Email});
        res.status(200).json({
            message: 'Successfully deleted user ' + req.body.Email
        });
    } else {
        res.status(200).json({
            message: 'Error: No user with that email'
        });
    }
});

app.get('/user/get_user_by_ID', async (req, res) => {
    const result = await client.db("TeachersPet").collection("Users").find({_id: req.body.id});

    if (result.Email != null) {
        const resultArr = await result.toArray();
        console.log(resultArr);
        res.status(200).json({
            message: 'User info: ' + JSON.stringify(resultArr[0]),
            user: resultArr[0]
        });
    } else {
        res.status(200).json({
            message: 'Error: no user with that ID'
        });
    }
});

app.get('/user/get_user_by_email', async (req, res) => {
    const result = await client.db("TeachersPet").collection("Users").find({"Email": req.body.Email});
    const resultArr = await result.toArray();

    if (resultArr[0] != null) {
        res.status(200).json({
            message: 'User info: ' + JSON.stringify(resultArr[0]),
            user: resultArr[0]
        });
    } else {
        res.status(200).json({
            message: 'Error: no user with that email'
        });
    }
});

app.get('/user/get_id_by_email', async (req, res) => {
    const result = await client.db("TeachersPet").collection("Users").findOne({"Email": req.body.Email});

    if (result.Email == null) {
        res.status(200).json({
            message: 'ERROR: No user with that email.'
        });
    } else {
        res.status(200).json({
            message: 'id: ' + result._id
        });
    }
});

app.post('/user/update_last_login', async (req, res) => {
    let returnMessage
    const result = await client.db("TeachersPet").collection("LastLogin").updateOne(
        {
            UserID: req.body.UserId
        },
        {
            $set:{
                TimeofLast: new Date()
            }
        },
        {$upsert: true}
    );

    console.log(result);
    if(result.upsertedCount == 0){
        returnMessage = "ERROR: incorrect user id, none match the given userID"
    }
    else{
        returnMessage = 'Successfully updated last login.'
    }

    res.status(200).json({
        message: returnMessage
    })
})


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




/////////////////////////////////////////////////////////////  Grades Help ////////////////////////////////////////////////

app.get('/GradeHelp/get_suggested_help_websites', (req, res) => {
    res.status(200).json({
        message: 'Successfully called GradeHelp/get_suggested_help_websites'
    });
});

app.get('/GradeHelp/get_suggested_help_tutoring', (req, res) => {
    res.status(200).json({
        message: 'Successfully called GradeHelp/get_suggested_help_websites'
    });
});

app.post('/GradeHelp/post_suggested_help', (req, res) => {
    res.status(200).json({
        message: 'Successfully called post_suggested_help'
    });
});

app.post('/Home', (req, res) => {
    res.status(201).json({
        message: 'Teachers Pet'
    });
});
// Start the Express server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


////////////////////////////////////////// OpenAI ///////////////////////////////////////////////////


// Route to get study tools for a course and assignment
app.post('/chatgpt/get_study_tools', async (req, res) => {
    const { courseName, assignmentName } = req.body;

    if (!courseName || !assignmentName) {
        return res.status(400).json({
            message: 'Error: Missing courseName or assignmentName in the request.'
        });
    }

    const prompt = `Provide study tools and useful website links to help with the assignment titled "${assignmentName}" for the course "${courseName}". Include things like helpful videos, online calculators, and tips for understanding key concepts.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ]
        });

        const generatedText = completion.choices[0].message.content.trim();

        res.status(200).json({
            message: 'Successfully generated study tools and resources.',
            studyTools: generatedText
        });
    } catch (error) {
        console.error('Error connecting to OpenAI API:', error.message);
        res.status(500).json({
            message: 'Error connecting to OpenAI API',
            error: error.message
        });
    }
});

//////////////////////////////Award////////////////////////////////////

async function fetchCanvasGrades() {
    try {
        const response = await axios.get('http://127.0.0.1:3001/canvas/get_grades');
        const data = response.data; // Access the full response object

        // Ensure data.grades exists and is an array
        if (data.grades && Array.isArray(data.grades)) {
            console.log("Canvas Grades:", data.grades); // Log data for debugging

            // Find the last course with a valid grade (not "No grade available")
            const lastValidGradeEntry = [...data.grades].reverse().find(gradeEntry => !gradeEntry.includes("Grades: No grade available"));

            if (lastValidGradeEntry) {
                console.log("Last valid grade entry:", lastValidGradeEntry);
                // Check if the last valid grade entry has a grade of "A"
                return lastValidGradeEntry.includes("Grades: B-");
            } else {
                console.log("No valid grades found in Canvas data.");
                return false;
            }
        } else {
            console.error("Grades data is not in the expected format for Canvas.");
            return false;
        }
    } catch (error) {
        console.error("Error fetching Canvas grades:", error.message);
        throw error;
    }
}

async function updateAwardCategory(email, awardId) {
    try {
        const collection = client.db("TeachersPet").collection("UserAwards");

        // Update the award category based on the user's email
        const result = await collection.updateOne(
            { Email: email, AwardId: awardId },
            { $set: { Category: 1 } },
            { upsert: true }
        );

        return result;
    } catch (error) {
        console.error("Error updating award category:", error);
        throw error;
    }
}

app.post('/award/update', async (req, res) => {
    const { email, awardId } = req.body;

    if (!email || !awardId) {
        return res.status(400).json({
            message: 'Error: Missing email or awardId in the request.'
        });
    }

    try {
        // Fetch grades from both Canvas and Google Classroom
        const canvasHasA = await fetchCanvasGrades();

        // If an "A" grade is found, update the award category in MongoDB
        if (canvasHasA) {
            const result = await updateAwardCategory(email, awardId);
            if (result.modifiedCount > 0 || result.upsertedCount > 0) {
                res.status(200).json({ message: "Award category updated successfully." });
            } else {
                res.status(500).json({ message: "Failed to update award category." });
            }
        } else {
            res.status(200).json({ message: "No 'A' grade found; no update made." });
        }
    } catch (error) {
        console.error("Error updating award category:", error);
        res.status(500).json({ message: "Error updating award category", error: error.message });
    }
});


////////////////////////////////////////// Gemini ///////////////////////////////////////////////////
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI("AIzaSyCdElodEb45ed2J-oqoWjiYbSnn69ecW84");

// app.post('/generate-content', async (req, res) => {
//     const { prompt } = req.body;

//     if (!prompt) {
//         return res.status(400).json({
//             message: 'Error: Missing prompt in the request.'
//         });
//     }

//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const result = await model.generateContent(prompt);

//         // Send the generated response back to the client
//         res.status(200).json({
//             message: 'Successfully generated content.',
//             response: result.response.text()
//         });
//     } catch (error) {
//         console.error('Error generating content:', error.message);
//         res.status(500).json({
//             message: 'Error generating content',
//             error: error.message
//         });
//     }
// });
// console.log(result.response.text());