const express = require('express');
const {MongoClient} = require("mongodb");
const app = express();
app.use(express.json());
const cors = require('cors')
const port = 5000;
const hostname = '127.0.0.1';
const OpenAI = require("openai");

const apiKey = '';

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
//test
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
