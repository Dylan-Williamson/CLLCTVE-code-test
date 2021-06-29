require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Project = require("./models/project");
const Comment = require("./models/comment");
const app = express();

var ObjectId = mongoose.Types.ObjectId

app.use(express.json());

app.get("/", (req, res) => {
  res.send("First Request");
});

app.get("/users", (req, res) => {
  User.find({}).exec(function(err, users){
    res.send(users);
  });
});

app.post("/users", async (req, res) => {
  try {
    const myUser = new User(req.body);
    await myUser.save()
    res.send(myUser)
  } catch(err) {
    res.send({ message: err })
  }
});

app.get("/users/:id/projects", (req, res) => {
  const id = new ObjectId(req.params.id);
  User.findOne({"_id":id}).populate("projects").exec(function(err, user){
    res.send(user.projects);
  });
});

app.post("/users/:id/projects", async (req, res) => {
  try {
    User
    .findById(req.params.id)
    .populate("projects")
    .exec().then(async function(user){
      try {
        const newProject = new Project({
          user: user,
          title: req.body.title,
        });
        await newProject.save();
        user.projects.push(newProject);
        await user.save()
        res.send(`${req.body.title} saved successfully!`);
      } catch(err) {
        console.log(err)
        res.send({ message: err })
      }
    });
  } catch(err) {
    res.send({ message: err })
  }
});

app.get("/projects", (req, res) => {
  Project.find({}).exec(function(err, projects){
    res.send(projects);
  });
});

app.get("/projects/:id/comments", (req, res) => {
  Project
  .findById(req.params.id)
  .populate("comments")
  .exec(function(err, project){
    res.send(project.comments);
  });
});

app.post("/projects/:id/comments", async (req, res) => {
  try {
    Project
    .findById(req.params.id)
    .populate("comments")
    .exec().then(async function(project){
      try {
        const newComment = new Comment({
          content: req.body.content,
          project: project,
          user: req.body.user,
        });
        await newComment.save();
        project.comments.push(newComment);
        await project.save()
        res.send(`Comment saved successfully!`);
      } catch(err) {
        console.log(err)
        res.send({ message: err })
      }
    });
  } catch(err) {
    res.send({ message: err })
  }
});



mongoose.connect(
  process.env.DB_CONNECTION_STRING,
  { useUnifiedTopology: true, useNewUrlParser: true},
  (req, res) => {
  console.log("connected to mongoDB");
})

app.listen(3000, () => {
  console.log('listening on 3000');
});