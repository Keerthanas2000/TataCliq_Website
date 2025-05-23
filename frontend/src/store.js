import { combineReducers, createStore } from "redux";
import currentProduct from "./reducers/currentProduct";
import cartReducer from "./reducers/cartReducer";
import wishlistReducer from "./reducers/wishListReducer"; // Add this import

const rootReducer = combineReducers({
  currentProduct,
  cart: cartReducer,
  wishlist: wishlistReducer, // Add wishlist reducer
});

const store = createStore(rootReducer);

export default store;