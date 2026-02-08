const express = require("express");
const Item = require("../models/Item");
const router = express.Router();

router.get("/", (req, res) => {
  Item.all((e, rows) => res.send(rows));
});

module.exports = router;
