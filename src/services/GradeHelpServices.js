const express = require("express");
const {MongoClient} = require("mongodb");
const app = express();
app.use(express.json());
const port = 3004;
const hostname = '127.0.0.1';
const { OpenAI } = require("openai");

//mongo connection
const uri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Start the Express server
app.listen(port, hostname, () => {
    console.log(`Grade help services server running at http://${hostname}:${port}/`);
});

app.get('/GradeHelp/get_suggested_help_websites', async (req, res) => {
    // Extract course and assignment names from the request body
    const { courseName, assignmentName } = req.body;

    if (!courseName || !assignmentName) {
        return res.status(400).json({
            message: 'Error: Missing courseName or assignmentName in the request.'
        });
    }

    // Define the prompt that will be sent to ChatGPT
    const prompt = `Provide study tools and useful website links to help with the assignment titled "${assignmentName}" for the course "${courseName}". Include things like helpful videos, online calculators, and tips for understanding key concepts.`;

    try {
        // Create a completion using the OpenAI library
        const completion = await openai.chat.completions.create({
            model: "gpt-4", // Use the desired model (gpt-3.5-turbo or gpt-4)
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ]
        });

        // Extract the response from the completion
        const generatedText = completion.choices[0].message.content.trim();

        // Return the generated study tools and links to the user
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