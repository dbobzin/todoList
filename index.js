// console.log("hello world");
// require("dotenv").config();
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/views", express.static("views"));

app.use(express.urlencoded({ extended: true }));

//connection to db
// mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(
  () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
  },
  (err) => {
    console.err(err.message);
  }
);

//view config
app.set("view engine", "ejs");

//get method
// GET METHOD
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

//POST METHOD
app.post("/", async (req, res) => {
  console.log("Info: Acquired data: " + JSON.stringify(req.body.content));
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    console.log("Info: Saved the to-do task.");
    res.redirect("/");
  } catch (err) {
    console.error("Error: Could not save to-do task.");
    res.redirect("/");
  }
});

// app.listen(3000, () => console.log("Server Up and running"));
//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
