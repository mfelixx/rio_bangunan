export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(0);
};

export const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
  state.taxPrice = addDecimals(Number((state.itemsPrice * 0.01).toFixed(0)));
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(0);

  localStorage.setItem("cart", JSON.stringify(state));
};
