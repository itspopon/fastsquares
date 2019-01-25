const path = require("path");

const express = require("express");

const router = express.Router();

router.get("/",(req, res, next) => {
  res.render("admin", {inGame: false, pageTitle: "Admin"});
});

module.exports = router;