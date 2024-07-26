import express from "express";

const port = 3000;

const server = express();

server.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
