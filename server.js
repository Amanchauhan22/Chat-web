import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
const app = express();

app.use(cors());

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

app.get("/auth", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});