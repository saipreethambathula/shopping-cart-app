const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  Cart.findActiveByUser(req.user.id, (e, cart) => {
    if (!cart) return res.status(400).send("No cart");
    Order.create(req.user.id, cart.id, cart.total_price, () => {
      Cart.close(cart.id);
      res.send("Order placed");
    });
  });
});

router.get("/", auth, (req, res) => {
  Order.listByUser(req.user.id, (e, rows) => res.send(rows));
});

module.exports = router;
