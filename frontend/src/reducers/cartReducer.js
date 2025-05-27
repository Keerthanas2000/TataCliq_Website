const initialState = {
  cartItems: [],
  cartCounter: 0,
  totalPrice: 0,
  deliveryCharges: 50,
  taxes: 0,
  grandTotal: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === newItem._id);

      if (existingItem) {
        const updatedCartItems = state.cartItems.map((item) =>
          item._id === newItem._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total_item_price: (item.quantity + 1) * item.price,
              }
            : item
        );

        const updatedTotalPrice = updatedCartItems.reduce((total, item) => total + item.total_item_price, 0);
        const updatedTaxes = updatedTotalPrice * 0.18;
        const updatedCartCounter = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          ...state,
          cartItems: updatedCartItems,
          cartCounter: updatedCartCounter,
          totalPrice: updatedTotalPrice,
          taxes: updatedTaxes,
          grandTotal: updatedTotalPrice + updatedTaxes + state.deliveryCharges,
        };
      } else {
        const updatedCartItems = [
          ...state.cartItems,
          {
            ...newItem,
            quantity: 1,
            total_item_price: newItem.price,
          },
        ];

        const updatedTotalPrice = updatedCartItems.reduce((total, item) => total + item.total_item_price, 0);
        const updatedTaxes = updatedTotalPrice * 0.18;
        const updatedCartCounter = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          ...state,
          cartItems: updatedCartItems,
          cartCounter: updatedCartCounter,
          totalPrice: updatedTotalPrice,
          taxes: updatedTaxes,
          grandTotal: updatedTotalPrice + updatedTaxes + state.deliveryCharges,
        };
      }
    }

    case "REMOVE_FROM_ITEM": {
      if (!action.payload || !action.payload.prod) {
        console.error("REMOVE_FROM_ITEM: action.payload.prod is undefined");
        return state;
      }

      const removedItem = state.cartItems.find((item) => item._id === action.payload.prod._id);
      if (!removedItem) return state;

      let updatedCartItems;
      if (action.payload.removeCompletely || removedItem.quantity <= 1) {
        updatedCartItems = state.cartItems.filter((item) => item._id !== action.payload.prod._id);
      } else {
        updatedCartItems = state.cartItems.map((item) =>
          item._id === action.payload.prod._id
            ? {
                ...item,
                quantity: item.quantity - 1,
                total_item_price: (item.quantity - 1) * item.price,
              }
            : item
        );
      }

      const updatedTotalPrice = updatedCartItems.reduce((total, item) => total + item.total_item_price, 0);
      const updatedTaxes = updatedTotalPrice * 0.18;
      const updatedCartCounter = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cartItems: updatedCartItems,
        cartCounter: updatedCartCounter,
        totalPrice: updatedTotalPrice,
        taxes: updatedTaxes,
        grandTotal: updatedTotalPrice + updatedTaxes + state.deliveryCharges,
      };
    }

    case "INCREMENT_PROD": {
      const itemToIncrement = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === itemToIncrement._id);

      if (!existingItem) return state;

      const updatedCartItems = state.cartItems.map((item) =>
        item._id === itemToIncrement._id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total_item_price: (item.quantity + 1) * item.price,
            }
          : item
      );

      const updatedTotalPrice = updatedCartItems.reduce((total, item) => total + item.total_item_price, 0);
      const updatedTaxes = updatedTotalPrice * 0.18;
      const updatedCartCounter = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cartItems: updatedCartItems,
        cartCounter: updatedCartCounter,
        totalPrice: updatedTotalPrice,
        taxes: updatedTaxes,
        grandTotal: updatedTotalPrice + updatedTaxes + state.deliveryCharges,
      };
    }

    case "DECREMENT_PROD": {
      const itemToDecrement = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === itemToDecrement._id);

      if (!existingItem) return state;

      let updatedCartItems;
      if (existingItem.quantity <= 1) {
        updatedCartItems = state.cartItems.filter((item) => item._id !== itemToDecrement._id);
      } else {
        updatedCartItems = state.cartItems.map((item) =>
          item._id === itemToDecrement._id
            ? {
                ...item,
                quantity: item.quantity - 1,
                total_item_price: (item.quantity - 1) * item.price,
              }
            : item
        );
      }

      const updatedTotalPrice = updatedCartItems.reduce((total, item) => total + item.total_item_price, 0);
      const updatedTaxes = updatedTotalPrice * 0.18;
      const updatedCartCounter = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        cartItems: updatedCartItems,
        cartCounter: updatedCartCounter,
        totalPrice: updatedTotalPrice,
        taxes: updatedTaxes,
        grandTotal: updatedTotalPrice + updatedTaxes + state.deliveryCharges,
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
        cartCounter: 0,
        totalPrice: 0,
        taxes: 0,
        grandTotal: state.deliveryCharges,
      };

    default:
      return state;
  }
};

export default cartReducer;