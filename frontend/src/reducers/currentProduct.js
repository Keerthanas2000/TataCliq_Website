
let parsedProduct = null;
let storedProduct = localStorage.getItem("currProd");

if (storedProduct && storedProduct !== "undefined") {
  try {
    parsedProduct = JSON.parse(storedProduct);
  } catch (err) {
    console.error("Error parsing product from localStorage:", err);
  }
}

let initialState = {
  prod: parsedProduct,
};

let currentProduct = (state = initialState, action) => {
  switch (action.type) {
    case "set_curr_prod":
      localStorage.setItem("currProd", JSON.stringify(action.payload));
      return {
        ...state,
        prod: action.payload,
      };

    default:
      return state;
  }
};

export default currentProduct;
