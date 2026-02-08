const db = require("../db/database");

module.exports = {
  add(cartId, itemId, price) {
    db.run(
      "INSERT INTO cart_items (cart_id,item_id,quantity,item_price) VALUES (?,?,1,?)",
      [cartId, itemId, price]
    );
  },

  list(cartId, cb) {
    db.all("SELECT * FROM cart_items WHERE cart_id=?", [cartId], cb);
  }
};
