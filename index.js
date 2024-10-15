const express = require("express");
const cors = require("cors");
// const cron = require("node-cron");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

//mongoose set up
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Connection events

mongoose.connection.on("connected", () => {
  const dbName = mongoose.connection.db.databaseName;
  console.log(`Mongoose connected to MongoDB database: ${dbName}`);
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

//init GridFS

let gridfsBucket;
mongoose.connection.once("open", () => {
  gridfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "songUploads", // Optional custom bucket name
  });
  // Set gfs as a local variable so it's accessible in other parts of the app
  app.locals.gridfsBucket = gridfsBucket;
});

//routes
app.use("/users", require("./routes/users"));
app.use("/projects", require("./routes/projects"));
app.use("/songs", require("./routes/songs"));
app.use("/mapping", require("./routes/mapping"));

app.listen(process.env.PORT || 6001, () => {
  console.log("server running");
});

function stop() {
  // Run some code to clean things up before server exits or restarts

  console.log("⬇ Killing process");
  process.exit(); // THEN EXITS THE PROCESS.
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
process.on("SIGQUIT", stop);

process.once("SIGUSR2", function () {
  // Run some code to do a different kind of cleanup on nodemon restart:
  process.kill(process.pid, "SIGUSR2");
});
