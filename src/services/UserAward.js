const express = require('express');
const axios = require('axios'); // For calling the get_grades API
const { MongoClient } = require('mongodb');
const cors = require('cors')

const router = express();
const canvasHost = 'http://127.0.0.1:3001'; // Base URL of your server.js
const mongoUri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const hostname = '127.0.0.1';
const port = 3005
// MongoDB Client
const client = new MongoClient(mongoUri);
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
    allowedHeaders: ['Authorization', 'Content-Type'],  // Allow specific headers
};
router.use(cors(corsOptions))
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
        if (grade >= 90) {
            category = "Excellence";
        } else if (grade >= 75) {
            category = "Honor Roll";
        } else if (grade >= 50) {
            category = "Participation";
        } else {
            category = "Needs Improvement";
        }

        awards.push({ course, grade, category });
    });

    return awards;
};
router.listen(port, hostname, () => {    console.log(`User Award is running at http://${hostname}:${port}/`);})

// Endpoint to process awards
router.post('/awards/process', async (req, res) => {
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
                const grade = parseFloat(gradePart.trim()) || 0; // Convert grade to a number
                return { course, grade };
            });

            const awards = categorizeAwards(gradeDetails);

            // Connect to MongoDB and insert awards
            await connectToMongo();
            const db = client.db('CanvasAwardsDB');
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

module.exports = router;
