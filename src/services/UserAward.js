const express = require('express');
const axios = require('axios'); // For calling the get_grades API
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const canvasHost = 'http://127.0.0.1:3001'; // Base URL of your server.js
const mongoUri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const hostname = '127.0.0.1';
const port = 3005;

// MongoDB Client
const client = new MongoClient(mongoUri);

// CORS Options
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Authorization', 'Content-Type'], // Allow specific headers
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json()); // Middleware for parsing JSON request bodies

// MongoDB Connection
const connectToMongo = async () => {
    try {
        if (!client.isConnected()) {
            await client.connect();
            console.log("Connected to MongoDB");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

// Award Categories Logic
const categorizeAwards = (grades) => {
    const awards = [];

    grades.forEach((gradeInfo) => {
        const { course, grade } = gradeInfo;

        let category;

        if (['A+', 'A', 'A-'].includes(grade)) {
            category = 1; // Excellence
        } else if (['B+', 'B', 'B-'].includes(grade)) {
            category = 2; // Honor Roll
        } else {
            category = 3; // Participation
        }

        awards.push({ course, grade, category });
    });

    return awards;
};

// Endpoint to process awards
app.post('/awards/process', async (req, res) => {
    const { token, userId } = req.body;

    if (!token || !userId) {
        return res.status(400).json({ message: "Token and userId are required" });
    }

    try {
        // Call the get_grades endpoint
        const response = await axios.get(`${canvasHost}/canvas/get_grades`, { params: { token } });

        if (response.status === 200) {
            const { grades } = response.data;

            // Process grades into award categories
            const gradeDetails = grades.map((gradeString) => {
                const [coursePart, gradePart] = gradeString.split(', Grades: ');
                const course = coursePart.replace('Course: ', '').trim();
                const grade = gradePart.trim(); // Use grade directly as a letter grade
                return { course, grade };
            });

            const awards = categorizeAwards(gradeDetails);

            // Connect to MongoDB and insert awards
            await connectToMongo();
            const db = client.db('TeachersPet');
            const collection = db.collection('UserAwards');

            const result = await collection.insertOne({
                userId,
                awards,
                createdAt: new Date(),
            });

            res.json({
                message: "Awards processed and published successfully",
                resultId: result.insertedId,
            });
        } else {
            res.status(response.status).json({
                message: "Error fetching grades",
                error: response.data,
            });
        }
    } catch (error) {
        console.error("Error processing awards:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Start the server
app.listen(port, hostname, () => {
    console.log(`User Award service is running at http://${hostname}:${port}/`);
});
