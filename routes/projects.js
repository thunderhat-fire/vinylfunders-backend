const express = require("express");
const app = express.Router();
const { nanoid } = require("nanoid");
const { Project, Image, Song } = require("../schemas/schemas");
// get all projects for a user id
app.get("/all/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const projects = await Project.find({ ownerId });
    const output = projects.map(async (project) => {
      const { projectId } = project;
      const thumbIds = await Image.find({ projectId });
      const thumbArray = thumbIds.map((e) => e.thumbId);
    });

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get single project for a project id
app.get("/single/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log("Received request for projectId:", req.params.projectId);
    const { artist, description, projectTitle, createdAt } =
      await Project.findOne({
        projectId,
      });
    const thumbIds = await Image.find({ projectId });
    const thumbArray = thumbIds.map((e) => e.thumbId);

    const songArray = await Song.find({ projectId });
    res.status(200).json({
      artist,
      description,
      projectTitle,
      createdAt,
      thumbArray,
      songArray,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// create new project
app.post("/", async (req, res) => {
  try {
    const { ownerId, projectId, projectTitle, artist, description } = req.body;
    const newProject = new Project({
      ownerId,
      projectId,
      projectTitle,
      artist,
      description,
      completed: false,
    });

    await newProject.save();
    res.status(200).send("new project created");
  } catch (err) {
    res.status(500).send(err);
  }
});

//update project

app.put("/complete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Project.findOneAndUpdate(
      { projectId: id },
      { $set: { completed: true } },
      { new: true }
    );

    res.status(200).send("project is live");
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete project

app.delete("/:id");

module.exports = app;
