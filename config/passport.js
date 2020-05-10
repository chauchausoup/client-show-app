const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportCustom = require('passport-custom')
const Client = require("../models/client");
const config = require("../config/database");



const CustomStrategy = passportCustom.Strategy;




module.exports = (passport) => {
  
  
  //implementing custom strategy

  passport.use(new CustomStrategy(
    function(req, done) {
      Client.findOne({
        groupname: req.body.groupname
      }, function (err, user) {
        done(err, user);
      });
    }
  ))
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Client.findById(id, function (err, user) {
      done(err, user);
    });
  });
  
  
  
 
}