
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [toastMessage, setToastMessage] = useState("");

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodie-cart")) || [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodie-user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("foodie-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("foodie-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("foodie-user");
    }
  }, [user]);

  const showToast = useCallback((message) => {
    setToastMessage(message);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage("");
  }, []);

  
  function addToCart(food) {
    // Support both MongoDB (_id) and local data (id)
    const foodId = food.id || food._id;
    const normalizedFood = {
      ...food,
      id: foodId,
    };

    setCart((previous) => {
      const existing = previous.find((item) => item.id === foodId);

      if (existing) {
        return previous.map((item) =>
          item.id === foodId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { ...normalizedFood, quantity: 1 }];
    });

    showToast(`${food.name} added to cart!`);
  }


  function updateQuantity(id, amount) {
    setCart((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((previous) => previous.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }
function logout() {
  localStorage.removeItem("foodie-token");
  setUser(null);
  showToast("You have been logged out.");
}

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee =
    subtotal === 0 || subtotal >= 499 ? 0 : 30;

  const total = subtotal + deliveryFee;

  return (
    <AppContext.Provider
      value={{
        cart,
        user,
        setUser,
        logout,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        total,
        toastMessage,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
