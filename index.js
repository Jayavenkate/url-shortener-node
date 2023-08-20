import express from "express";
import shortid from "shortid";
import { MongoClient } from "mongodb";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
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

app.get("/urls", async function (req, res) {
  const result = await getUrl();
  if (result) {
    res.send(result.splice(-1));
  } else {
  }
});
app.post("/shorten", async function (req, res) {
  const { url } = req.body;
  const shortUrl = shortid.generate(url);
  const now = new Date();
  const create_at = now.toLocaleString();
  const result = await insertData(url, shortUrl, create_at);
  if (result) {
    res.send({ message: "inserted successfully", result: result });
  } else {
    res.status(401).send("Not authorized");
  }
});
app.get("/:shorturl", async function (req, res) {
  const { shorturl } = req.params;
  const urlFromDb = await redirectUrl(shorturl);
  if (!urlFromDb) {
    res.status(401).send({ message: "invalid url" });
  } else {
    res.redirect(urlFromDb.long_url);
  }
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
