const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Users = require("../models/User");
const checker = require("../middlewares/checker");

router.get("/courses", checker.checkLogin, (req, res) => {
  if (
    req.user.role === "TA" ||
    req.user.role === "Student" ||
    req.user.role === "Boss"
  ) {
    Course.find()
      .sort({ title: 1 })
      .then(courses => {
        res.render("courses/index", { courses });
      });
  } else {
    req.flash("msg", "You are not allowed to visit this page");
    res.redirect("/private");
  }
});

router.get("/courses/create", checker.checkLogin, (req, res) => {
  Users.find().then(students => {
    res.render("courses/create", { students });
  });
});

router.get("/courses/:id", checker.checkLogin, (req, res, next) => {
  Course.findById(req.params.id)
    .populate("students")
    .select({ _id: 0 })
    .then(course => {
      res.render("courses/detail", { course });
    })
    .catch(error => next(error));
});

router.post("/courses/create", checker.checkLogin, (req, res) => {
  const newCourse = {
    title: req.body.title,
    duration: req.body.duration,
    field: req.body.field,
    type: req.body.type,
    students: req.body.students
  };

  Course.create(newCourse)
    .then(courses => {
      res.redirect("/courses");
    })
    .catch(error => {
      console.log(error);
      res.render("courses/create");
    });
});

router.get("/courses/:id/edit", (req, res, next) => {
  Course.findById(req.params.id)
    .then(course => {
      Users.find().then(students => {
        res.render("courses/edit", { course, students });
      });
    })
    .catch(error => next(error));
});

router.post("/courses/:id", (req, res, next) => {
  const { title, duration, field, type, students } = req.body;

  Course.findByIdAndUpdate(
    req.params.id,
    { title, duration, field, type, $push: { students } },
    { new: true }
  )
    .then(course => {
      res.redirect("/courses");
    })
    .catch(error => next(error));
});

router.post("/courses/:id/delete", (req, res, next) => {
  Course.findByIdAndRemove(req.params.id)
    .then(deletedCourse => {
      res.redirect("/courses");
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
