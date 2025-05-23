import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer"
import cartReducer from "./cartReducer"
import currentProduct from "./currentProduct";
import wishListReducer from "./wishListReducer"

const rootReducer=combineReducers({
            user:userReducer,
            wishlist:wishListReducer,
            cart:cartReducer,
            currentprod:currentProduct
})

export default rootReducer;