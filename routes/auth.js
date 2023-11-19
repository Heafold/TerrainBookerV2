const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      req.flash("error", "Nom d'utilisateur introuvable.");
      return res.redirect("/auth/login");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      req.flash("error", "Mot de passe incorrect.");
      return res.redirect("/auth/login");
    }

    req.session.user = {
      id: user._id,
      profile: user.profile,
    };

    if (user.profile == "Admin") {
      res.redirect("/admin/dashboard");
    } else if (user.profile == "User") {
      res.redirect("/user/dashboard");
    } else {
      req.flash("error", "Profil utilisateur non reconnu.");
      return res.redirect("/auth/login");
    }
  } catch (error) {
    console.error(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la tentative de connexion."
    );
    res.redirect("/auth/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

module.exports = router;
