const { OpenAIApi } = require("openai");

// Initialize the OpenAI API with the provided API key
const openai = new OpenAIApi({
    apiKey: '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',
});

// Route to get study tools for a course and assignment
app.post('/chatgpt/get_study_tools', async (req, res) => {
    const { courseName, assignmentName } = req.body;

    if (!courseName || !assignmentName) {
        return res.status(400).json({
            message: 'Error: Missing courseName or assignmentName in the request.'
        });
    }

    const prompt = `Provide study tools and useful website links to help with the assignment titled "Calculus review" for the course "Calc 1". Include things like helpful videos, online calculators, and tips for understanding key concepts.`;

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4o-mini", 
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ]
        });

        const generatedText = completion.data.choices[0].message.content.trim();

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

// Route to get college services information
app.post('/chatgpt/get_college_services', async (req, res) => {
    const { collegeName } = req.body;

    if (!collegeName) {
        return res.status(400).json({
            message: 'Error: Missing collegeName in the request.'
        });
    }

    const prompt = `Provide information on tutoring services and health services available at ${collegeName}. Include details such as where students can access these services, contact information, and any notable programs or resources offered by the college.`;

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4o-mini", 
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ]
        });

        const generatedText = completion.data.choices[0].message.content.trim();

        res.status(200).json({
            message: 'Successfully generated information on college services.',
            servicesInfo: generatedText
        });
    } catch (error) {
        console.error('Error connecting to OpenAI API:', error.message);
        res.status(500).json({
            message: 'Error connecting to OpenAI API',
            error: error.message
        });
    }
});
