const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.end("Your server is running on port 5000.");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
