const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const port = 3000;
require("dotenv").config();
const flash = require("connect-flash");

const dbUrl = process.env.DB_MONGO;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "Erreur de connexion à la base de données :")
);
db.once("open", () => {
  console.log("Connexion à la base de données réussie !");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "pug");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
