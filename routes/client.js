const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const flash = require("connect-flash");
const passport = require("passport");

let Client = require("../models/client");


router.get("/register", (req, res) => {
  res.render("register", {
    title: "REGISTER HERE",
  });
});

router.post(
  "/register",
  [
    check("username").isLength({ min: 1 }).trim().withMessage("Name Required"),
    check("groupname").isLength({ min: 1 }).trim().withMessage("Group Name  Required"),
    check("locationname").isLength({ min: 1 }).trim().withMessage("Location Required"),
    check("phoneno").isLength({ min: 10 }).trim().withMessage("Phone No  at least 10 digit long"),
    check("description").isLength({ min: 20 }).trim().withMessage("Description at least 20 digits"),

],

  (req, res) => {
    let client = new Client({
      username: req.body.username,
      groupname: req.body.groupname,
      locationname: req.body.locationname,
      phoneno: req.body.phoneno,
      description: req.body.description



    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("register", {
        client: client,
        errors: errors.mapped(),
      });
    } else {
      client.username = req.body.username;
      client.groupname = req.body.groupname;
      client.locationname = req.body.locationname;
      client.phoneno = req.body.phoneno;
      client.description = req.body.description;

      client.save((err) => {
        if (err) throw err;
        req.flash("success", "Name Registered");
        res.redirect("/client/login");
      });
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login", {
    title: "PLEASE LOGIN HERE",
  });
});

router.post(
  "/login",
  passport.authenticate("custom", { failureRedirect: "/client/login" }),
  function (req, res) {
    res.redirect("/client/show");
  }
);

router.get("/show", ensureAuthenticated, (req, res) => {
  Client.find({}, (err, client) => {
    if (err) {
      console.error("there is an error");
    } else {
      res.render("show", {
        clients: client,
      });
    }
  });
});

router.get("/logout", ensureAuthenticated, (req, res, next) => {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/");
});

router.get("/show/:id", ensureAuthenticated, function (req, res) {
  Client.findById(req.params.id, function (err, client) {
    res.render("single_show", {
      client: client,
      title: "Client Info:",
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please Login");
    res.redirect("/client/login");
  }
}

/* router.post('/login',(req,res,next)=>{

    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/client/login',
        failureFlash:true
    })(req,res,next)
})
 */

module.exports = router;
