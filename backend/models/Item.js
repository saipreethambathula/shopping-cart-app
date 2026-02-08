const db = require("../db/database");

module.exports = {
  all(cb) {
    db.all("SELECT * FROM items", [], cb);
  },

  findById(id, cb) {
    db.get("SELECT * FROM items WHERE id=?", [id], cb);
  }
};
