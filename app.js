const express = require("express");
const path = require("path");
const db = require("./config/database");
const cors = require("cors");
const wordRouter = require("./routes/wordRouter");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test our Database
db.authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("error:", err);
  });

app.use('/words', wordRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running at Port = PORT`);
});
