
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/foodApi";

export default function OrderSuccess() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchOrder() {
      try {
        const token = localStorage.getItem("foodie-token");

        if (!token) {
          setError("Please log in to view your order.");
          return;
        }

        const response = await API.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cancelled) {
          setOrder(response.data.order);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load your order. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="page-container empty-state">
        <h1>Loading your order...</h1>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="page-container empty-state">
        <h1>Unable to display order</h1>
        <p>{error || "We couldn't find this order."}</p>
        <Link to="/my-orders" className="btn">
          Go to My Orders
        </Link>
      </main>
    );
  }

  const orderId = order._id || order.id;

  return (
    <main className="page-container">
      <section className="success-card">
        <div className="success-icon">✓</div>

        <div className="success-banner" role="status">
          Order placed successfully!
        </div>

        <h1>Thank you for your order, {order.customerName}!</h1>
        <p>Your order has been saved. Here's your order summary.</p>

        <div className="success-details">
          <div>
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{order.status}</strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : order.paymentMethod}
            </strong>
          </div>

          <div>
            <span>Total</span>
            <strong>₹{order.total}</strong>
          </div>
        </div>

        <h3>Delivery address</h3>
        <p>
          {order.address.address}, {order.address.city} -{" "}
          {order.address.pincode}
        </p>

        <div className="success-actions">
          <Link to="/my-orders" className="btn">
            View My Orders
          </Link>

          <Link to="/search" className="btn btn-outline">
            Order more food
          </Link>
        </div>
      </section>
    </main>
  );
}
