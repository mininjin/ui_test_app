const express = require("express");
const { resolve } = require("path");
const cors = require("cors")

const app = express();

app.use(cors());
app.use("/", express.static(resolve(__dirname, "../dist")));

const mockData = require("./mock.json");
app.get("/api/questionnaires", (_, res) => {
  res.json(mockData);
});

const port = 4000;
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
