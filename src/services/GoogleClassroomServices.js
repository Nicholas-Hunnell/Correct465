const express = require("express");
const {MongoClient} = require("mongodb");
const app = express();
const https = require('https');
const { OAuth2Client } = require("google-auth-library");

const port = 3002;
const hostname = '127.0.0.1';

//mongo connection
const uri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
var clientId

// Start the Express server
app.listen(port, hostname, async () => {
    console.log(`Google Classroom services server running at http://${hostname}:${port}/`);
    const clientId = client.db("TeachersPet").collection("GoogleClassroomAuthInformation").findOne({service:"googleClassroom"});
    console.log(await clientId);
});


//Authentication
const gtoken = 'ya29.a0AeDClZAee2Jo5E7VXuy9Rt0AMrbvMepFFCBJqB3nKMqvt3LLyJO4mB25QDcDyUrRfelkNgY-Jo9QV-LUZCadEs2YWhsuWDsq6wnaL1x9MoMqxaJBM2tWxsy319TPD7TVDudwaGUjv-Qkqpi_7mtd2CFmkf3x6gL_0YavXHWXaCgYKAS8SARESFQHGX2MiU3EDyPEupgJ5lW3S7gb-9g0175';
//const clientId = "719533638212-nsi6gd0rgcpeb8opiq8emoqieq4bdh85.apps.googleusercontent.com";

const clientSecret = "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"; // Set this in a .env file
const redirectUri = "http://localhost:"+port+"/auth/google/callback"; // OAuth callback
const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);


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

app.get("/auth/google", (req, res) => {
    const scopes = [
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.rosters.readonly"
    ];

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline", // Allows refresh token
        scope: scopes,
    });

    res.redirect(authUrl);
})

app.get("/auth/google/callback", async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send("Authorization code is missing");
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Store token in MongoDB
        console.log(
            "Token: "+tokens.access_token+"\n"+
            "Refresh token: "+tokens.refresh_token+"\n"+
            "Expiry date: "+tokens.expiry_date
        )
        res.redirect("http://localhost:3000/");

    } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        res.status(500).send("Authentication failed");
    }
});