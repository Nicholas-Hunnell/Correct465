const express = require("express");
const {MongoClient, ObjectId} = require("mongodb");
const app = express();
const cors = require('cors');
const {post} = require("axios");
app.use(cors());
app.use(express.json());

const port = 3006;
const hostname = '127.0.0.1';

const uri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

app.listen(port, hostname, async () => {
    console.log(`Photo services server running at http://${hostname}:${port}/`);
});


app.post('/photo/updateGifs', async (req, res) => {

    var input = req.body;

    try {
        // Find the existing GIFs document for the user
        var oldGifs = await client.db("TeachersPet").collection("Gifs").findOne({ userId: input.userId });

        if (!oldGifs) {
            const result = await client.db("TeachersPet").collection("Gifs").insertOne({
                "userId":input.userId,
                "gifs": {
                    "A":"https://media.tenor.com/EmZ0N3llkAkAAAAM/cat-cats.gif",
                    "B":"https://media.tenor.com/v3DAIe73r00AAAAM/happy-cat-smile-cat.gif",
                    "C":"https://media.tenor.com/hnH5r-jI1M8AAAAM/pipa-cat-pipa.gif",
                    "D":"https://i.pinimg.com/originals/d9/df/92/d9df9239a488ae9f2f5efd5f0b56af5e.gif",
                    "F":"https://media1.tenor.com/images/9413ffc5a11722a3cc456a88810750bd/tenor.gif?itemid=14193216"
                }
            });
            oldGifs = await client.db("TeachersPet").collection("Gifs").findOne({ userId: input.userId });
        }

        // Update the GIFs array
        oldGifs.gifs = input.newGifs;

        const result = await client.db("TeachersPet").collection("Gifs").updateOne(
            { userId: input.userId },
            { $set: oldGifs }
        );

        if (result.modifiedCount === 0) {
            return res.status(304).json({ message: "No changes were made to the GIFs." });
        }

        console.log("New GIFs posted successfully");
        res.status(200).json({ message: "New GIFs posted successfully"});
    } catch (error) {
        console.error("Error posting new GIFs:", error);
        res.status(500).json({
            error: "Error posting to database.",
            details: error.message
        });
    }
});

app.get('/photo/getGifs', async (req, res) => {

    var input = req.query.userId;

    try {
        // Find the existing GIFs document for the user
        const oldGifs = await client.db("TeachersPet").collection("Gifs").findOne({ userId: input });

        if (!oldGifs) {
            const oldGifs = await client.db("TeachersPet").collection("Gifs").findOne({ userId: "DEFAULT"});
            console.log("No gifs found for this user, returning default gifs");
            res.status(200).json(oldGifs.gifs);
        }
        else{
            res.status(200).json(oldGifs.gifs);
        }

    } catch (error) {
        console.error("Error getting GIFs:", error);
        res.status(500).json({
            error: "Error retrieving to database.",
            details: error.message
        });
    }
});