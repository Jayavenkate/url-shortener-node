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
// app.get("/url", async function (request, response) {
//   const result = await client
//     .db("b42wd2")
//     .collection("urlshort")
//     .find({})
//     .toArray();
//   response.send(result.splice(-1));
// });

// app.get("/:shorturl", async function (request, response) {
//   const { shorturl } = request.params;
//   const urlFromDb = await client
//     .db("b42wd2")
//     .collection("urlshort")
//     .findOne({ short_url: shorturl });

//   if (!urlFromDb) {
//     response.status(401).send({ message: "invalid url" });
//   } else {
//     response.redirect(urlFromDb.short_url);
//   }
// });

// app.post("/create", async function (req, res) {
//   const { url } = req.body;
//   const shorturl = shortid.generate(url);
//   const result = await client.db("b42wd2").collection("urlshort").insertOne({
//     long_url: url,
//     short_url: shorturl,
//   });
//   if (result) {
//     res.send({ message: "insert Successfully", result: result });
//   } else {
//     res.status(401).send("Not authorized");
//   }
// });

//shorten link
app.post("/create", async function (req, res) {
  const { longUrl } = req.body;
  const shortUrl = shortid.generate();
  const result = await client.db("b42wd2").collection("shortUrl").insertOne({
    longUrl: longUrl,
    shortUrl: shortUrl,
  });
  console.log(result);
  if (result) {
    res.send({ message: "insert successfully" });
  } else {
    res.status(401).send("Not authorized");
  }
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
