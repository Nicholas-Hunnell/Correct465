const express = require('express');
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const uri = "mongodb+srv://admin:<db_password>@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Function to update award category in MongoDB
async function updateAwardCategory(userId, awardId) {
    try {
        await client.connect();
        const collection = client.db("TeachersPet").collection("UserAwards");

        // Update the award category to 1 if the student has an "A" grade
        const result = await collection.updateOne(
            { UserId: userId, AwardId: awardId },
            { $set: { Category: 1 } },
            { upsert: true }
        );

        return result;
    } catch (error) {
        console.error("Error updating award category:", error);
    } finally {
        await client.close();
    }
}

// Helper function to call the Canvas grades API
async function fetchCanvasGrades() {
    try {
        const response = await axios.get('http://127.0.0.1:3001/canvas/get_grades');
        const data = response.data;
        
        // Check if any course has an "A" grade based on your API structure
        const hasA = data.includes("Grade: A");  // Modify this line if grades are returned in a different format
        return hasA;
    } catch (error) {
        console.error("Error fetching Canvas grades:", error.message);
        throw error;
    }
}

// Helper function to call the Google Classroom grades API
async function fetchGoogleClassroomGrades() {
    try {
        const response = await axios.get('http://127.0.0.1:3002/Gclass/get_grades');
        const data = response.data;
        
        // Assuming grades are returned similarly to Canvas in a format where "Grade: A" exists
        const hasA = data.includes("Grade: A");  // Modify this based on actual response structure
        return hasA;
    } catch (error) {
        console.error("Error fetching Google Classroom grades:", error.message);
        throw error;
    }
}

app.post('/award/update', async (req, res) => {
    const { email, awardId } = req.body;

    try {
        // Connect to MongoDB
        await client.connect();
        const usersCollection = client.db("TeachersPet").collection("Users");
        const awardsCollection = client.db("TeachersPet").collection("UserAwards");

        // Find the user by email (or modify to use another identifier if needed)
        const user = await usersCollection.findOne({ Email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Extract the UserId
        const userId = user._id.toString();

        // Check grades and update the award category if applicable
        const canvasHasA = await fetchCanvasGrades();
        const googleClassroomHasA = await fetchGoogleClassroomGrades();

        if (canvasHasA || googleClassroomHasA) {
            const result = await awardsCollection.updateOne(
                { UserId: userId, AwardId: awardId },
                { $set: { Category: 1 } },
                { upsert: true }
            );

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
    } finally {
        await client.close();
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//test