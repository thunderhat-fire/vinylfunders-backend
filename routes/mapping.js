const express = require("express");
const app = express.Router();
const { User } = require("../schemas/schemas");

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await User.findOne({ id });
    if (!data) {
      res.status(400).send("User not found");
      return;
    }
    console.log("route ran", id, data);
    console.log(data, id);
    if (req.params.id === data.id) {
      res.status(200).send(process.env.GOOGLE_MAPS_KEY);
    } else {
      res.status(400).send("Invalid request");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = app;
