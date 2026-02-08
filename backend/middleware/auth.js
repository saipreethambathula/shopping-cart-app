const jwt = require("jsonwebtoken");
const db = require("../db/database");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("Token missing");

  jwt.verify(token, "SECRET_KEY", (err, decoded) => {
    if (err) return res.status(401).send("Invalid token");

    db.get(
      "SELECT * FROM users WHERE id=? AND token=?",
      [decoded.id, token],
      (err, user) => {
        if (!user) return res.status(401).send("Session expired");
        req.user = user;
        next();
      },
    );
  });
};
