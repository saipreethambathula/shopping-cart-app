const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  User.create(req.body.username, hash, err =>
    err ? res.status(400).send(err) : res.send("User created")
  );
});

router.post("/login", (req, res) => {
  User.findByUsername(req.body.username, async (err, user) => {
    if (!user) return res.status(400).send("Invalid credentials");
    if (user.token)
      return res.status(403).send("Already logged in elsewhere");

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ id: user.id }, "SECRET_KEY");
    User.setToken(user.id, token, () => res.send({ token }));
  });
});

router.post("/logout", auth, (req, res) => {
  User.clearToken(req.user.id, () => res.send("Logged out"));
});

router.get("/", (req, res) => {
  require("../db/database").all(
    "SELECT id,username FROM users",
    [],
    (e, rows) => res.send(rows)
  );
});

module.exports = router;
