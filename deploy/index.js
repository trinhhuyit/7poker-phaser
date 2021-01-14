const express = require("express");
const path = require("path");

const app = express();
// app.use(cors());
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});
const port = 6868;
app.listen(port);
console.log(`Start client server on ${port}`);
