const express = require("express");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Item = require("../models/Item");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { item_id } = req.body;

  Cart.findActiveByUser(req.user.id, (e, cart) => {
    const handleCart = cart
      ? Promise.resolve(cart.id)
      : new Promise(resolve =>
          Cart.create(req.user.id, id => resolve(id))
        );

    handleCart.then(cartId => {
      Item.findById(item_id, (e, item) => {
        CartItem.add(cartId, item_id, item.price);
        Cart.updateTotal(cartId, item.price);
        res.send("Item added to cart");
      });
    });
  });
});

router.get("/", auth, (req, res) => {
  Cart.findActiveByUser(req.user.id, (e, cart) => {
    if (!cart) return res.send([]);
    CartItem.list(cart.id, (e, rows) => res.send(rows));
  });
});

module.exports = router;
