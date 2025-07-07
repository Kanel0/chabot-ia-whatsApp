
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const messageRoutes = require("./src/routes/Routes");

const app = express();
app.use(bodyParser.json());
app.use("/api", messageRoutes);

const PORT = process.env.PORT || 8040;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

});