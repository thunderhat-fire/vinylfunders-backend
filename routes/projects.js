const express = require("express");
const app = express.Router();
const { nanoid } = require("nanoid");
const { Project } = require("../schemas/schemas");
// get all projects for a user id
app.get("/project/:id", async (req, res) => {
  const { id } = req.params;
});

// get single project for a project id
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
});

// create new project
app.post("/", async (req, res) => {
  //project IDs need to be fully distinct from user IDs with no possibility of crossovers, so all project IDs get prefixed with _
  const count = await Project.countDocuments();
  const uniqueId = "_" + count + nanoid();
  try {
  } catch (err) {
    res.status(500).send(err);
  }
});

//update project

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete project

app.delete("/:id");

module.exports = app;
