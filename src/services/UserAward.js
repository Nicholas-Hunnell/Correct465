const express = require('express');
const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const canvasHost = 'http://127.0.0.1:3001'; // Base URL of your server.js
const mongoUri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority";
const hostname = '127.0.0.1';
const port = 3005;

// MongoDB Client
const client = new MongoClient(mongoUri);

// CORS Options
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const connectToMongo = async () => {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
        console.log("Connected to MongoDB");
    }
};

const categorizeAwards = (grades) => {
    const awards = [];

    grades.forEach((gradeInfo) => {
        const { course, grade } = gradeInfo;

        let category;

        // Assign specific categories for individual grades
        switch (grade) {
            case 'A+':
                category = 1; // Excellence - Top Performer
                break;
            case 'A':
                category = 2; // Excellence
                break;
            case 'A-':
                category = 3; // High Achiever
                break;
            case 'B+':
                category = 4; // Above Average
                break;
            case 'B':
                category = 5; // Average
                break;
            case 'B-':
                category = 6; // Satisfactory
                break;
            case 'C+':
                category = 7; // Needs Improvement
                break;
            case 'C':
                category = 8; // Below Average
                break;
            case 'C-':
                category = 9; // At Risk
                break;
            default:
                category = 10; // Participation - Other grades (e.g., D, F)
        }

        awards.push({ course, grade, category });
    });

    return awards;
};

// Combined Endpoint: View or Process Awards
app.get('/awards/view', async (req, res) => {
    const { userId, token } = req.query;

    if (!userId || !token) {
        return res.status(400).json({ success: false, message: 'User ID and token are required' });
    }

    try {
        await connectToMongo();
        const db = client.db('TeachersPet');
        const collection = db.collection('UserAwards');

        // Check if user awards already exist
        let userAwards = await collection.findOne({ userId: new ObjectId(userId) });

        if (!userAwards) {
            console.log("User ID not found. Processing awards...");
            
            // Fetch grades using the token
            const response = await axios.get(`${canvasHost}/canvas/get_grades`, { params: { token } });

            if (response.status === 200) {
                const { grades } = response.data;

                // Process grades into award categories
                const gradeDetails = grades.map((gradeString) => {
                    const [coursePart, gradePart] = gradeString.split(', Grades: ');
                    const course = coursePart.replace('Course: ', '').trim();
                    const grade = gradePart.trim();
                    return { course, grade };
                });

                const awards = categorizeAwards(gradeDetails);

                // Insert processed awards into MongoDB
                const result = await collection.insertOne({
                    userId: new ObjectId(userId),
                    token,
                    awards,
                    createdAt: new Date(),
                });

                userAwards = { awards };
                console.log("Awards processed and saved:", result.insertedId);
            } else {
                return res.status(response.status).json({
                    success: false,
                    message: "Error fetching grades",
                    error: response.data,
                });
            }
        }

        res.json({ success: true, data: userAwards.awards });
    } catch (error) {
        console.error('Error processing or fetching awards:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Start the server
app.listen(port, hostname, () => {
    console.log(`User Award service is running at http://${hostname}:${port}/`);
});
