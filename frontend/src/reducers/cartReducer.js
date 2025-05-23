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
    case 'add_to_cart': {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item._id === newItem._id);

      if (existingItem) {
        const updatedCartItems = state.cartItems.map(item =>
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

    case 'remove_from_cart': {
      if (!action.payload) {
        console.error("remove_from_cart: action.payload is undefined");
        return state;
      }

      const removedItem = state.cartItems.find(item => item._id === action.payload._id);
      if (!removedItem) return state;

      let updatedCartItems;
      if (action.removeCompletely || removedItem.quantity <= 1) {
        updatedCartItems = state.cartItems.filter(item => item._id !== action.payload._id);
      } else {
        updatedCartItems = state.cartItems.map(item =>
          item._id === action.payload._id
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

    default:
      return state;
  }
};

export default cartReducer;