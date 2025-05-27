export const addTocart = (prod) => ({
  type: "ADD_TO_CART",
  payload: prod,
});

export const removeProd = (prod, removeCompletely = false) => ({
  type: "REMOVE_FROM_ITEM",
  payload: { prod, removeCompletely },
});

export const incrementProd = (prod) => ({
  type: "INCREMENT_PROD",
  payload: prod,
});

export const decrementProd = (prod) => ({
  type: "DECREMENT_PROD",
  payload: prod,
});

export const addToWishlist = (prod) => ({
  type: "add_to_wishlist",
  payload: prod,
});

export const removeFromWishlist = (product) => ({
  type: "remove_from_wishlist",
  payload: product,
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});