const express = require("express");
const app = express.Router();
const getAuth0Token = require("../utils/getAuth0Token");
const { User } = require("../schemas/schemas");
const removeEmptyFields = require("../utils/utils");
//get user details
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findOne({ id: id });
    data ? res.status(200).send(data) : res.status(200).send({});
  } catch (err) {
    res.status(500).send(err);
  }
});
//create new user
app.post("/", async (req, res) => {
  try {
    const { username, name, email, googleId, address, phone } = req.body;
    const count = await User.countDocuments();

    const newUser = new User({
      username,
      name,
      email,
      address,
      phone,
      id: googleId,
    });
    console.log(newUser);
    //error codes
    //11000 - dup email / username
    //
    const response = await newUser.save();

    res.status(200).send(`New user with ID ${googleId} created`);
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
    console.log("delete ID ran", id);
    const data = await User.findOne({ id });
    console.log(data);
    if (!data) {
      res.status(400).send("User not found");
      return;
    }
    //remove from our DB
    const response = await User.deleteOne({ id });
    //remove from auth0

    ///FIX THIS AT A LATER DATE - NON ESSENTIAL CURRENTLY
    // const token = getAuth0Token();
    // console.log("token", token);
    // const options = {
    //   method: "DELETE",
    //   url: `https://login.auth0.com/api/v2/users/:${id}`,
    //   headers: {
    //     "content-type": "application/json",
    //     authorization: `Bearer ${token}`,
    //   },
    // };
    // const deleted = await axios.request(options);

    res.status(200).send("User deleted");
    //delete bands and projects code
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = app;
