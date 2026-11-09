
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import API from "../api/foodApi";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    user,
    subtotal,
    deliveryFee,
    total,
    clearCart,
    showToast,
  } = useApp();

  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handlePlaceOrder(event) {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in before placing an order.");
      return;
    }

    if (!localStorage.getItem("foodie-token")) {
      setError("Your login session is missing. Please log in again.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (form.address.trim().length < 5) {
      setError("Enter your complete delivery address.");
      return;
    }

    if (!form.city.trim()) {
      setError("Enter your city.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/orders",
        {
          items: cart.map((item) => ({
            foodId: String(item.id || item._id),
            quantity: item.quantity,
          })),
          address: {
            phone: form.phone,
            address: form.address.trim(),
            city: form.city.trim(),
            pincode: form.pincode,
          },
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("foodie-token")}`,
          },
        }
      );

      const savedOrder = response.data.order;

      clearCart();
      showToast("Order placed successfully!");

      // Use MongoDB's order ID
      navigate(`/order-success/${savedOrder._id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your login session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Could not place your order. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <main className="page-container empty-state">
        <h1>Your cart is empty</h1>
        <p>Add food to your cart before checking out.</p>
        <Link to="/search" className="btn">
          Explore food
        </Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">FINAL STEP</span>
        <h1>Checkout</h1>
        <p>Enter your delivery details to place your order.</p>
      </div>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        <section className="checkout-form-card">
          <h2>Delivery information</h2>

          {user ? (
            <p className="muted">
              Ordering as {user.name} ({user.email})
            </p>
          ) : (
            <p className="form-note">
              You need to <Link to="/login">log in</Link> before placing an order.
            </p>
          )}

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <label htmlFor="phone">Mobile number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            required
          />

          <label htmlFor="address">Full delivery address</label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            placeholder="House number, street, area..."
            required
          />

          <div className="checkout-fields-row">
            <div>
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Your city"
                required
              />
            </div>

            <div>
              <label htmlFor="pincode">PIN code</label>
              <input
                id="pincode"
                name="pincode"
                inputMode="numeric"
                maxLength={6}
                value={form.pincode}
                onChange={handleChange}
                placeholder="6 digits"
                required
              />
            </div>
          </div>

          <h2 className="payment-heading">Payment method</h2>

          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(event) => setPaymentMethod(event.target.value)}
            />
            <span>
              <strong>Cash on Delivery</strong>
              <small>Pay when your order arrives</small>
            </span>
          </label>

          <label className="payment-option payment-disabled">
            <input type="radio" name="paymentPreview" disabled />
            <span>
              <strong>Online payment</strong>
              <small>Not configured in this demo</small>
            </span>
          </label>

          <button
            className="btn checkout-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Placing order..." : `Place order · ₹${total}`}
          </button>

          <p className="checkout-disclaimer">
            Demo checkout only. No online payment is processed.
          </p>
        </section>

        <aside className="bill-card">
          <h2>Your order</h2>

          {cart.map((item) => (
            <div className="checkout-item" key={item.id || item._id}>
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <p>Qty: {item.quantity}</p>
              </div>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="bill-row">
            <span>Delivery fee</span>
            <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>

          <div className="bill-row bill-total">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>
        </aside>
      </form>
    </main>
  );
}
