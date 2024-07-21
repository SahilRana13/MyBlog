import express from "express";
import { db, connectToDb } from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.status(200).json(article);
  } else {
    res.sendStatus(404);
  }
});

app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;

  await db.collection("articles").updateOne({ name }, { $inc: { upvotes: 1 } });

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.status(200).send(`${name} now has ${article.upvotes} upvotes`);
  } else {
    res.send("Article not found");
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { postedBy, text } = req.body;
  const { name } = req.params;

  await db
    .collection("articles")
    .updateOne({ name }, { $push: { comments: { postedBy, text } } });

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.status(200).send(article);
  } else {
    res.send("Article not found");
  }
});

connectToDb(() => {
  app.listen(8000, () => {
    console.log("Successfully connected to the database");
    console.log("Server is running on port 8000");
  });
});

export default app;
