const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");

// Middleware pour vérifier si l'utilisateur est un utilisateur standard
function isUser(req, res, next) {
  if (req.session && req.session.user && req.session.user.profile === "User") {
    return next();
  } else {
   return res.redirect("/auth/login");
  }
}

router.get("/dashboard", isUser ,async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await UserModel.findOne({ _id: req.session.userId });
      if (user) {
        res.render("dashboard", { user });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.error(error);
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
