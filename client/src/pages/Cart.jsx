
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
  } = useApp();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main className="page-container empty-state">
        <div style={{ fontSize: 55 }}>🛒</div>
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything delicious yet.</p>
        <Link to="/search" className="btn">
          Explore food
        </Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">ALMOST THERE</span>
        <h1>Your shopping cart</h1>
        <p>Review your dishes before placing your order.</p>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="muted">{item.restaurantName}</p>
                <strong>₹{item.price}</strong>

                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>

              <div className="quantity-control">
                <button
                  aria-label={`Decrease ${item.name} quantity`}
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  aria-label={`Increase ${item.name} quantity`}
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
              </div>

              <strong className="cart-line-total">
                ₹{item.price * item.quantity}
              </strong>
            </article>
          ))}
        </section>

        <aside className="bill-card">
          <h2>Bill details</h2>

          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="bill-row">
            <span>Delivery fee</span>
            <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>

          {subtotal > 0 && subtotal < 499 && (
            <p className="bill-tip">
              Add ₹{499 - subtotal} more for free delivery.
            </p>
          )}

          <div className="bill-row bill-total">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>

          <button
            className="btn checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout →
          </button>

          <Link to="/search" className="continue-shopping">
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
