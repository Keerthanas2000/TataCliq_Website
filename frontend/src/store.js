import { combineReducers, createStore } from "redux";
import currentProduct from "./reducers/currentProduct";
import cartReducer from "./reducers/cartReducer";
import wishlistReducer from "./reducers/wishListReducer"; // Add this import
import userReducer from "./reducers/userReducer";

const rootReducer = combineReducers({
  currentProduct,
  cart: cartReducer,
  wishlist: wishlistReducer, 
  user: userReducer,
});

const store = createStore(rootReducer);

export default store;