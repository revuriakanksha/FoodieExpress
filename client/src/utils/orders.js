const ORDERS_KEY = "foodie-demo-orders";

export function getSavedOrders() {
  try {
    const orders = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || "[]"
    );

    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  const orders = getSavedOrders();

  // Prevent accidentally saving the same order twice.
  const alreadyExists = orders.some(
    (item) => item.id === order.id
  );

  const updatedOrders = alreadyExists
    ? orders
    : [order, ...orders];

  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(updatedOrders)
  );

  // Confirm that the order was saved.
  const savedOrders = getSavedOrders();

  if (!savedOrders.some((item) => item.id === order.id)) {
    throw new Error("Order could not be saved.");
  }

  return order;
}