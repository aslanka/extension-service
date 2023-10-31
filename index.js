const express = require("express");
const { MongoClient } = require("mongodb");

const PORT = 8080;
const app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const uri =
  "mongodb+srv://ayushlanka106:IgxLFNHHoD6o6Y07@cluster0.eayzgr4.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const db_name = "ParentalGuard";

async function getUrlsByUsername(username) {
  try {
    await client.connect();
    const database = client.db(db_name); // Replace with your database name
    const collection = database.collection("Users"); // Replace with your collection name

    const user = await collection.findOne({ username: username });
    return user;
  } catch (error) {
    console.error("Error while retrieving user:", error);
    return null;
  } finally {
    client.close();
  }
}

app.get("/user/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await getUrlsByUsername(username);

    if (user) {
      res.json(user["urls"]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log("Example app is listening on port 8080."));
