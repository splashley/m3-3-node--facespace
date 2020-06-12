"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res
    .status(200)
    .render("pages/homepage", { currentUser: currentUser, users: users });
};

// handleProfilePage function
const handleProfilePage = (req, res) => {
  let id = req.params._id;
  let currentUser = users.find((user) => {
    return user._id === id;
  });
  // define userFriends
  let userFriends = [];
  // loop over current user's friends
  // inside our loop, look up the friendUser and push object to userFriends
  currentUser.friends.forEach((friendId) => {
    let friendUser = users.find((user) => {
      return user._id === friendId;
    });
    userFriends.push(friendUser);
  });
  res.status(200).render("pages/profile", {
    user: currentUser,
    userFriends: userFriends,
  });
};

// handleSignin function
const handleSignin = (req, res) => {
  res.status(200).render("pages/signin");
};

// handleName function
const handleName = (req, res) => {
  const firstName = req.query.firstName;
  let loginName = users.find((user) => {
    return user.name === firstName;
  });
  if (loginName) {
    res.status(200).redirect(`/users/${loginName._id}`);
  } else {
    res.status(404).redirect("/signin");
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)

  // create endpoint for user profiles
  .get("/users/:_id", handleProfilePage)

  // create endpoint for signin page
  .get("/signin", handleSignin)

  // create a GET endpoint that will receive the data from the form
  .get("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
