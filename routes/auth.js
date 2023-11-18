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
      return res.redirect("/login?error=1");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.redirect("/login?error=2");
    }

    req.session.userId = user._id;

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.redirect("/login?error=3");
  }
});

module.exports = router;