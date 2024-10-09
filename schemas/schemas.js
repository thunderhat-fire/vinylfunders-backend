const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

const projectSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  projectId: { type: String, required: true },
  name: { type: String, required: true },
});

const Project = mongoose.model("Project", projectSchema);

const songSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  projectId: { type: String, required: true },
  songId: { type: String, required: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Song = mongoose.model("Song", songSchema);

module.exports = { User, Project, Song };
