const db = require("../db/database");

module.exports = {
  findActiveByUser(userId, cb) {
    db.get(
      "SELECT * FROM carts WHERE user_id=? AND status='ACTIVE'",
      [userId],
      cb
    );
  },

  create(userId, cb) {
    db.run(
      "INSERT INTO carts (user_id,status) VALUES (?,?)",
      [userId, "ACTIVE"],
      function () {
        cb(this.lastID);
      }
    );
  },

  updateTotal(cartId, amount) {
    db.run(
      "UPDATE carts SET total_price = total_price + ? WHERE id=?",
      [amount, cartId]
    );
  },

  close(cartId) {
    db.run("UPDATE carts SET status='ORDERED' WHERE id=?", [cartId]);
  }
};
