const express = require("express");
const {MongoClient} = require("mongodb");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const port = 3003; //3003
const hostname = '127.0.0.1';
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');


const cors = require("cors");
app.use(cors());


const uri = "mongodb+srv://admin:admin@cluster0.lv5o6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);


app.listen(port, hostname, () => {
    console.log(`User services server running at http://${hostname}:${port}/`);
});



app.post('/user/create_user', async (req, res) => {

    //check if the email is already in use
    const emailTaken = await client.db("TeachersPet").collection("Users").findOne({Email: req.body.Email})

    if (emailTaken) {
        res.status(201).json({
            message: 'Error: email ' + req.body.Email + " is already in use."
        });
    } else {
        const user = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            CollegeName: req.body.CollegeName,
            Email: req.body.Email,
            Password:req.body.Password,
            DashboardService: req.body.DashboardService,
            ...(req.body.CanvasToken && { CanvasToken: req.body.CanvasToken })
        };

        const result = await client.db("TeachersPet").collection("Users").insertOne(user);
        var userId = await client.db("TeachersPet").collection("Users").findOne({Email: req.body.Email});
        userId = userId._id;
        const result2 = await client.db("TeachersPet").collection("Gifs").insertOne({
                "userId":userId.toString(),
                "gifs": {
                    "A":"https://media.tenor.com/EmZ0N3llkAkAAAAM/cat-cats.gif",
                    "B":"https://media.tenor.com/v3DAIe73r00AAAAM/happy-cat-smile-cat.gif",
                    "C":"https://media.tenor.com/hnH5r-jI1M8AAAAM/pipa-cat-pipa.gif",
                    "D":"https://i.pinimg.com/originals/d9/df/92/d9df9239a488ae9f2f5efd5f0b56af5e.gif",
                    "F":"https://media1.tenor.com/images/9413ffc5a11722a3cc456a88810750bd/tenor.gif?itemid=14193216"
                }
        });

        res.status(201).json({
            message: 'Successfully called user/create_user\nFirstName ' + user.FirstName + '\n' + 'Using ' + user.DashboardService
        });
    }
});

app.post('/user/modify_user', async (req, res) => {
    const userId = new ObjectId(req.body.id);

    try {
        // Check if the email is already in use by another user
        const emailTaken = await client.db("TeachersPet").collection("Users").findOne({
            Email: req.body.Email,
            _id: { $ne: userId }, // Ensure it's not the same user
        });

        if (emailTaken) {
            return res.status(400).json({
                message: `Error: Email ${req.body.Email} is already in use.`,
            });
        }

        // Fetch the current user data
        const currentUser = await client.db("TeachersPet").collection("Users").findOne({ _id: userId });

        if (!currentUser) {
            return res.status(404).json({
                message: 'Error: User not found.',
            });
        }

        // Update fields only if provided
        const updatedUser = {
            ...currentUser,
            FirstName: req.body.FirstName || currentUser.FirstName,
            LastName: req.body.LastName || currentUser.LastName,
            CollegeName: req.body.CollegeName || currentUser.CollegeName,
            Email: req.body.Email || currentUser.Email,
            Password: req.body.Password || currentUser.Password,
            DashboardService: req.body.DashboardService || currentUser.DashboardService,
            CanvasToken: req.body.CanvasToken || currentUser.CanvasToken,
            googleClassroomToken: req.body.googleClassroomToken || currentUser.googleClassroomToken,
        };

        // Update user in the database
        await client.db("TeachersPet").collection("Users").updateOne(
            { _id: userId },
            { $set: updatedUser }
        );

        res.status(200).json({
            message: 'Successfully modified user',
        });
    } catch (e) {
        console.error('Error modifying user:', e);
        res.status(500).json({
            message: 'Error: Could not modify user',
        });
    }
});

app.delete('/user/delete_user', async (req, res) => {
    const result = await client.db("TeachersPet").collection("Users").findOne({"Email": req.body.Email});

    if (result) {
        const result = await client.db("TeachersPet").collection("Users").deleteOne({"Email": req.body.Email});

        res.status(200).json({
            message: 'Successfully deleted user ' + req.body.Email
        });
    } else {
        res.status(200).json({
            message: 'Error: No user with that email'
        });
    }
});

app.get('/user/get_user_by_ID', async (req, res) => {
    try {
        const userId = new ObjectId(req.query.id);

        const result = await client.db("TeachersPet").collection("Users").find({_id: userId});

        const resultArr = await result.toArray();

        console.log("Called get_user_by_ID");

        if (resultArr.length > 0) {
            res.status(200).json({
                message: 'User info: ' + JSON.stringify(resultArr[0]),
                user: resultArr[0]
            });
        } else {
            res.status(404).json({
                message: 'Error: no user with that ID'
            });
        }
    } catch (e) {
        console.error('Error:', e);
        res.status(500).json({
            message: 'Error: invalid ID or server issue'
        });
    }
});

app.get('/user/get_user_by_email', async (req, res) => {
    const result = await client.db("TeachersPet").collection("Users").find({"Email": req.body.Email});
    const resultArr = await result.toArray();

    if (resultArr[0] != null) {
        res.status(200).json({
            message: 'User info: ' + JSON.stringify(resultArr[0]),
            user: resultArr[0]
        });
    } else {
        res.status(200).json({
            message: 'Error: no user with that email'
        });
    }
});

app.get('/user/get_id_by_email', async (req, res) => {
    const result = await client.db("TeachersPet").collection("Users").findOne({"Email": req.body.Email});

    if (result.Email == null) {
        res.status(200).json({
            message: 'ERROR: No user with that email.'
        });
    } else {
        res.status(200).json({
            message: 'id: ' + result._id
        });
    }
});


app.post('/user/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;


        const user = await client.db("TeachersPet").collection("Users").findOne({ Email });

        if (!user) {
            return res.status(404).json({ message: "User does not exist in the database" });
        }


        if (Password !== user.Password) {
            return res.status(401).json({ message: "Password is incorrect" });
        }


        const token = jwt.sign({ userId: user._id, email: user.Email }, 'your_jwt_secret', { expiresIn: '1000000h' });


        const { Password: _, ...userData } = user;

        res.status(200).json({
            message: "Login Successful",
            token,
            user: userData,
        });
    } catch (error) {
        res.status(500).json({ message: "Error with login", error: error.message });
    }
})

app.post('/user/update_last_login', async (req, res) => {
    const result = await client.db("TeachersPet").collection("LastLogin").updateOne(
        {
            UserID: req.body.UserId
        },
        {
            $set:{
                TimeofLast: new Date()
            }
        },
        {$upsert: true}
    );

    console.log(result);
    if(result.upsertedCount == 0){
        returnMessage = "ERROR: incorrect user id, none match the given userID"
    }
    else{
        returnMessage: 'Successfully updated last login.'
    }

    res.status(200).json({
        message: returnMessage
    })
})

//test