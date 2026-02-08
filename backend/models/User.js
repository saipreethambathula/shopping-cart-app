const db = require("../db/database");

module.exports = {
  findByUsername(username, cb) {
    db.get("SELECT * FROM users WHERE username=?", [username], cb);
  },

  create(username, password, cb) {
    db.run(
      "INSERT INTO users (username,password) VALUES (?,?)",
      [username, password],
      cb,
    );
  },

  setToken(id, token, cb) {
    db.run("UPDATE users SET token=? WHERE id=?", [token, id], cb);
  },

  clearToken(id, cb) {
    db.run("UPDATE users SET token=NULL WHERE id=?", [id], cb);
  },
};
