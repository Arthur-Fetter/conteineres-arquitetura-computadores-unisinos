import express from "express";

const app = express();
const port = process.env.PORT || 8082;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
