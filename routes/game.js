const path = require("path");

const express = require("express");

const router = express.Router();

router.get("/",(req, res, next) => {
  res.render("game.ejs", {inGame: true, pageTitle: "Game"});
});

module.exports = router;