const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const ReservationModel = require("../models/Reservation");

// Middleware pour vérifier si l'utilisateur est un utilisateur standard
function isUser(req, res, next) {
  if (req.session && req.session.user && req.session.user.profile === "User") {
    return next();
  } else {
   return res.redirect("/auth/login");
  }
}

router.get("/dashboard", isUser, async (req, res) => {
    try {
      const userId = req.session.user.id;
  
      const user = await UserModel.findById(userId);
      let reservs = await ReservationModel.find({ user: userId });
      let allreservs = await ReservationModel.find({ user: { $ne: userId } })
                                             .populate('user');

      reservs = reservs.map(reserv => {
        return {
          ...reserv.toObject(),
          reservationDate: reserv.reservationDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
        };
      });

      allreservs = allreservs.map(allreserv => {
        return {
          ...allreserv.toObject(),
          reservationDate: allreserv.reservationDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
        };
      });
  
      res.render("user/dashboard", { user, reservs, allreservs});
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      res.status(500).send("Erreur interne du serveur");
    }
  });
  

  
  router.get("/reservs/new", isUser, async (req, res) => {
    res.render("user/reservNew");
  });

  router.post("/reservs/new", isUser, async (req, res) => {
    const { terrain, reservationDate, reservationTime } = req.body;
  
    try {
      const newReservation = new ReservationModel({
        terrain,
        user: req.session.user.id,
        reservationDate,
        reservationTime
      });
  
      await newReservation.save();
      res.redirect("/user/dashboard")
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      res.redirect("/user/reservs/new")
    }
  });
  
  router.post("/reservs/delete/:id", isUser, async (req, res) => {
    const reservID = req.params.id;
  
    try {
      const reserv = await ReservationModel.findByIdAndDelete(reservID);
  
      if (!reserv) {
        req.flash('error', "Réservation non trouvé ou déjà supprimé.");
        return res.redirect('/user/dashboard');
      }
      res.redirect('/user/dashboard');
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation:", error);
      req.flash('error', "Erreur lors de la suppression de la réservation.");
      res.redirect('/user/dashboard');
    }
  });

module.exports = router;
