const express = require("express");
const router = require("./routes/route.js");
const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.end("Your server is running on port 5000.");
});
app.use("/api", router);

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
