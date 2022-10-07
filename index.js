const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 1000;


// middle ware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kx7ki8f.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();

    // const database = client.db('ProfileAdd');
    // const usersCollection = database.collection("users");

    const usersData = client.db('userInformation').collection('users');

    // get api 
    app.get('/userInfo', async (req, res) => {
      const cursor = usersData.find({});
      const users = await cursor.toArray();
      res.send(users)
    })

    // POST API 
    app.post('/userInfo', async (req, res) => {
      const newProfile = req.body;
      const result = await usersData.insertOne(newProfile);
      console.log('got new profile', newProfile)
      res.json(result);
    })

    // Delete API 
    app.delete('/userInfo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersData.deleteOne(query);
      console.log("deleting user with id", result)
      res.json(result)
    })


  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("hello world")
})


app.listen(port, () => {
  console.log('Listening the port', port)
})