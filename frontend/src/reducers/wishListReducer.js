const initialState = {
  items: [],
};

const wishlistReducer = (state = initialState, action) => {
  console.log("Wishlist Reducer - Action:", action);
  console.log("Wishlist Reducer - Current State:", state);
  switch (action.type) {
    case "add_to_wishlist":
      if (state.items.find(item => item._id === action.payload._id)) {
        console.log("Item already in wishlist:", action.payload._id);
        return state;
      }
      console.log("Adding item to wishlist:", action.payload);
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "remove_from_wishlist":
      console.log("Removing item from wishlist:", action.payload._id);
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export default wishlistReducer;