const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const ReservationModel = require("../models/Reservation");

// Middleware pour vérifier si l'utilisateur est un admin
function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.profile === "Admin") {
    return next();
  } else {
    return res.redirect("/auth/login");
  }
}

router.get("/dashboard", isAdmin, async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments();
    const reservCount = await ReservationModel.countDocuments();

    res.render("admin/dashboard", { userCount, reservCount });
  } catch (error) {
    console.error("Erreur lors du comptage des utilisateurs:", error);
    res.status(500).send("Erreur interne du serveur");
  }
});

router.get("/users", isAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  try {
    results.totalCount = await UserModel.countDocuments();
    results.users = await UserModel.find().limit(limit).skip(startIndex);

    results.totalPages = Math.ceil(results.totalCount / limit);
    results.currentPage = page;

    res.render("admin/users", { results });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).send("Erreur interne du serveur");
  }
});

router.get("/users/new", isAdmin, async (req, res) => {
    res.render("admin/userNew");
  });

router.get("/users/edit/:id", isAdmin, async (req, res) => {
    const userID = req.params.id;
    try {
      const user = await UserModel.findById(userID);
      res.render("admin/userEdit", { user });
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      res.status(500).send("Erreur interne du serveur");
    }
  });

  router.post("/users/edit/:id", isAdmin, async (req, res) => {
    const userID = req.params.id;
    const { username, password, profile } = req.body;
  
    try {
      const user = await UserModel.findById(userID);
  
      if (!user) {
        req.flash('error', "Utilisateur non trouvé.");
        return res.redirect('/admin/users');
      }
  
      user.username = username;
      user.profile = profile;
  
      if (password && password.trim() !== '') {
        user.password = password;
      }
  
      await user.save();
  
      req.flash('success', "Utilisateur mis à jour avec succès.");
      res.redirect('/admin/users');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      req.flash('error', "Erreur lors de la mise à jour de l'utilisateur.");
      res.redirect(`/admin/users/edit/${userID}`);
    }
  });
  

router.post("/users/new", isAdmin, async (req, res) => {
    try {
      const { username, password, profile} = req.body;
  
      const newUser = new UserModel({ username, password, profile });
      await newUser.save();

      res.redirect('/admin/users');
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      req.flash('error', 'Erreur lors de la création de l utilisateur.');
      res.redirect('/admin/users/new');
    }
  });

  router.post("/users/delete/:id", isAdmin, async (req, res) => {
    const userID = req.params.id;
  
    try {
      const user = await UserModel.findByIdAndDelete(userID);
  
      if (!user) {
        req.flash('error', "Utilisateur non trouvé ou déjà supprimé.");
        return res.redirect('/admin/users');
      }
  
      res.redirect('/admin/users');
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      req.flash('error', "Erreur lors de la suppression de l'utilisateur.");
      res.redirect('/admin/users');
    }
  });

  router.get("/reservs", isAdmin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const results = {};
  
    try {
      results.totalCount = await ReservationModel.countDocuments();
      results.reservs = await ReservationModel.find().limit(limit).skip(startIndex);
  
      results.totalPages = Math.ceil(results.totalCount / limit);
      results.currentPage = page;
  
      res.render("admin/reservs", { results });
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      res.status(500).send("Erreur interne du serveur");
    }
  });

  router.post("/reservs/delete/:id", isAdmin, async (req, res) => {
    const reservID = req.params.id;
  
    try {
      const reserv = await ReservationModel.findByIdAndDelete(reservID);
  
      if (!reserv) {
        req.flash('error', "Réservation non trouvé ou déjà supprimé.");
        return res.redirect('/admin/reservs');
      }
  
      res.redirect('/admin/reservs');
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation:", error);
      req.flash('error', "Erreur lors de la suppression de la réservation.");
      res.redirect('/admin/reservs');
    }
  });

module.exports = router;
