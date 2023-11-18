const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");

router.get('/dashboard', async (req, res) => {
    if (req.session.userId) {
        try {
            const user = await UserModel.findOne({ _id: req.session.userId });
            if (user) {
                res.render('dashboard', { user });
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.error(error);
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;