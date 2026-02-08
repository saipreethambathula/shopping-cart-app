const db = require("../db/database");

module.exports = {
  create(userId, cartId, total, cb) {
    db.run(
      "INSERT INTO orders (user_id,cart_id,total_price) VALUES (?,?,?)",
      [userId, cartId, total],
      cb,
    );
  },

  listByUser(userId, cb) {
    db.all("SELECT * FROM orders WHERE user_id=?", [userId], cb);
  },
};
