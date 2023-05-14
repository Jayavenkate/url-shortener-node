import express from "express";
import shortid from "shortid";
import { MongoClient } from "mongodb";
import cors from "cors";
import * as dotenv from 'dotenv'
dotenv.config()
const app = express();

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");
app.use(cors());
app.use(express.json());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});
app.get("/url", async function (request, response) {
  const result = await client
    .db("b42wd2")
    .collection("urlshort")
    .find({})
    .toArray();
  response.send(result);
});

app.post("/short", async function (request, response) {
  const { url } = request.body;
  const shortUrl = shortid.generate(url);
  const result = await client.db("b42wd2").collection("urlshort").insertOne({
    long_url: url,
    short_url: shortUrl,
  });
  response.send({ message: "inserted Successfully", result: result });
});

app.get("/:shorturl", async function (request, response) {
  const { shortUrl } = request.params;
  const urlFromDb = await client
    .db("b42wd2")
    .collection("urlshort")
    .findOne({ short_url: shortUrl });
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
  if (!urlFromDb) {
    response.status(401).send({ message: "invalid url" });
  } else {
    res.redirect(urlFromDb.long_url);
  }
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
