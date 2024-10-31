const express = require("express");
const {MongoClient} = require("mongodb");
const app = express();
const port = 3002;
const hostname = '127.0.0.1';

//mongo connection
const uri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);


// Start the Express server
app.listen(port, hostname, () => {
    console.log(`Google Classroom services server running at http://${hostname}:${port}/`);
});

const gtoken = 'ya29.a0AeDClZDEh7xcBKO_A5YW1C4IxQ6B_gCrEq0LYyz4beBwPyhpdm5vCJHu3h2wVaUlIgkQNUuEhr1dDgRLXFISL_p68IneGSKkuzXmEGWln3P7NwiEUB8PyUPQZXdHJGji0YQwqmgGIq9ECA1owr3VpUCHS4IiW6LUoO20L8tzaCgYKAVQSARESFQHGX2MiMHAjd17tYOMxykOBNF5ghQ0175';


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

                if (Array.isArray(courses.courses)) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('<html><body><p>Student Courses:</p><ul>');

                    courses.courses.forEach(course => {
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
            message: 'Error connecting to Google Classroom API',
            error: error.message
        });
    });

    apiRequest.end(); // Close the request properly
});

app.get('/Gclass/get_grades', (req, res) => {
    res.status(200).json({
        message: 'Successfully Gclass/get_grades'
    });
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
    const pm2 = require('pm2');
    pm2.connect((err) => {
        if (err) {
            console.error(err);
            process.exit(2);
        }

        pm2.start({
            script: 'googleClassroomAuth.js',
            name: 'gClassAuth' // Give it a name
        }, (err, apps) => {
            if (err) {
                console.error(err);
                process.exit(2);
            }

            console.log('Second service started');
        });
    });

    const options = {
        hostname: '127.0.0.1',
        port: 6000,
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

