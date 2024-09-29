const express = require("express");
const app = express.Router();
const { nanoid } = require("nanoid");
const { User } = require("../schemas/schemas");
const removeEmptyFields = require("../utils/utils");
//get user details
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findOne({ id: id });
    data ? res.status(200).send(data) : res.status(400).send("User not found");
  } catch (err) {
    res.status(500).send(err);
  }
});
//create new user
app.post("/", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const count = await User.countDocuments();
    const uniqueId = count + nanoid();
    const newUser = new User({
      username,
      name,
      email,
      password,
      id: uniqueId,
    });
    console.log(newUser);
    //error codes
    //11000 - dup email / username
    //
    const response = await newUser.save();

    res.status(200).send(`New user with ID ${uniqueId} created`);
  } catch (err) {
    res.status(500).send(err);
  }
});
//update user
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await User.findOne({ id });
    if (!data) {
      res.status(400).send("User not found");
      return;
    }
    //only pass data fields to be updated from client side
    const updateData = req.body;

    const cleanUpdateData = removeEmptyFields(updateData);
    const response = await User.findOneAndUpdate({ id }, cleanUpdateData);

    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});
//delete user
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findOne({ id });
    if (!data) {
      res.status(400).send("User not found");
      return;
    }
    const response = await User.deleteOne({ id });
    res.send("User deleted");
    //delete bands and projects code
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = app;
