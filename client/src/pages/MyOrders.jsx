
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import API from "../api/foodApi";

export default function MyOrders() {
  const { user } = useApp();

  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchMyOrders() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("foodie-token");

        if (!user || !token) {
          setError("Please log in again to view your orders.");
          return;
        }

        const response = await API.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cancelled) {
          setMyOrders(response.data.orders || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load your orders. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMyOrders();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <main className="page-container empty-state">
        <h1>Please log in</h1>
        <p>Log in to view your orders.</p>
        <Link to="/login" className="btn">
          Login
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="page-container empty-state">
        <h1>Loading your orders...</h1>
        <p>Please wait while we retrieve your order history.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container empty-state">
        <h1>Unable to load orders</h1>
        <p>{error}</p>
        <Link to="/search" className="btn">
          Explore food
        </Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">YOUR FOOD JOURNEY</span>
        <h1>My Orders</h1>
        <p>Track the orders you have placed.</p>
      </div>

      {myOrders.length === 0 ? (
        <section className="empty-state">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link to="/search" className="btn">
            Explore food
          </Link>
        </section>
      ) : (
        <div className="orders-list">
          {myOrders.map((order) => (
            <article className="bill-card" key={order._id}>
              <h2>Order #{order._id}</h2>

              <p>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Date unavailable"}
              </p>

              <p>
                <strong>Status:</strong> {order.status || "Order placed"}
              </p>

              {order.items?.map((item, index) => (
                <div
                  className="checkout-item"
                  key={`${order._id}-${item.foodId || index}`}
                >
                  <img
                    src={item.image || ""}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />

                  <div>
                    <strong>{item.name}</strong>
                    <p>Qty: {item.quantity}</p>
                  </div>

                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}

              <div className="bill-row bill-total">
                <strong>Total</strong>
                <strong>₹{order.total}</strong>
              </div>

              <p>
                <strong>Payment:</strong>{" "}
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : order.paymentMethod}
              </p>

              <p>
                <strong>Delivery address:</strong>{" "}
                {order.address?.address}, {order.address?.city} -{" "}
                {order.address?.pincode}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
