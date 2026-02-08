import React, { useEffect, useState } from "react";
import { ShoppingCart, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/"); // not logged in → redirect
      return;
    }
    fetchItems();
    fetchCartCount();
  }, [token]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${baseURL}/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${baseURL}/carts`, {
        headers: { Authorization: token },
      });
      if (!res.ok) return;
      const data = await res.json();
      const count = data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const res = await fetch(`${baseURL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ item_id: item.id }),
      });
      const message = await res.text();
      if (!res.ok) throw new Error(message || "Failed to add item to cart");
      alert(message);
      fetchCartCount();
    } catch (err) {
      alert(err.message);
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
      navigate("/");
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
          <p className="text-center mt-10">Loading items...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-500 mt-1">${item.price}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-4 w-full py-3 bg-black text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                >
                  Add to Cart <ShoppingCart size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
