import React, { useEffect, useState } from "react";
import { ShoppingCart, LogOut, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [itemsMap, setItemsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const cartRes = await fetch(`${baseURL}/carts`, {
        headers: { Authorization: token },
      });
      if (!cartRes.ok) throw new Error("Failed to fetch cart");
      const cartData = await cartRes.json();

      const combined = {};
      cartData.forEach((c) => {
        if (combined[c.item_id]) {
          combined[c.item_id].quantity += c.quantity;
          combined[c.item_id].item_price += c.item_price;
        } else {
          combined[c.item_id] = { ...c };
        }
      });
      setCartItems(Object.values(combined));

      const count = Object.values(combined).reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      setCartCount(count);

      const itemsRes = await fetch(`${baseURL}/items`);
      if (!itemsRes.ok) throw new Error("Failed to fetch items");
      const itemsData = await itemsRes.json();
      const map = {};
      itemsData.forEach((item) => {
        map[item.id] = item;
      });
      setItemsMap(map);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${baseURL}/users/logout`, {
        method: "POST",
        headers: { Authorization: token },
      });
      if (!res.ok) throw new Error("Logout failed");
      localStorage.removeItem("token");
      navigate("/auth");
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await fetch(`${baseURL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ items: cartItems }),
      });
      if (!res.ok) throw new Error("Failed to place order");
      setShowOrderModal(true);
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <Link to="/home" className="text-xl font-bold">
          Shopping Cart
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition font-semibold"
          >
            Logout <LogOut size={18} />
          </button>
          <Link to="/cart" className="relative">
            <ShoppingCart size={28} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <main className="p-6">
        {loading ? (
          <p className="text-center mt-10">Loading cart items...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-center mt-10 text-gray-500">Your cart is empty</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cartItems.map((cart) => {
                const item = itemsMap[cart.item_id];
                if (!item) return null;
                return (
                  <div
                    key={cart.item_id}
                    className="bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">{item.name}</h2>
                      <p className="text-gray-500 mt-1">
                        Price: ${cart.item_price}
                      </p>
                      <p className="text-gray-500 mt-1">
                        Quantity: {cart.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handlePlaceOrder}
                className="flex items-center justify-center gap-2 mx-auto bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition font-semibold"
              >
                Place Order <CheckCircle size={20} />
              </button>
            </div>
          </>
        )}
      </main>

      {showOrderModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-lg">
            <CheckCircle size={48} className="text-green-500" />
            <h2 className="text-2xl font-bold">Order Placed!</h2>
            <p className="text-gray-500">Thank you for your purchase.</p>
            <button
              onClick={() => setShowOrderModal(false)}
              className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
