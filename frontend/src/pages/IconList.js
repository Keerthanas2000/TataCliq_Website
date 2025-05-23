import React from "react";
import { Link } from "react-router-dom";
import { setCurrentProduct } from "../actions/setCurrentProduct";
import { addTocart } from "../actions/CartActions";
import { useDispatch } from "react-redux";


import Swal from "sweetalert2"
function IconList({ prod }) {
  const dispatch = useDispatch();

  const handleCurrProd = () => {
    dispatch(setCurrentProduct(prod));
  };

  const handleshoppingbagclick=()=>
  {
    dispatch(addTocart(prod));

    Swal.fire({
      title: "Product added to cart",
        icon: "success"
    });
  }

  return (
    <>
      <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
        <Link to={{ pathname: "/details/" }} onClick={handleCurrProd}>
          <li className="icon" title="View Details">
            <span className="fas fa-expand-arrows-alt"></span>
          </li>
        </Link>

        <Link to="#" onClick={() => alert("Add to Wishlist")}>
          <li className="icon mx-3"  title="Move to wishlist">
            <span className="far fa-heart"></span>
          </li>
        </Link>
        <Link to="#" onClick={handleshoppingbagclick}>
          <li className="icon"  title="+ Add to cart">
            <span className="fas fa-shopping-bag"></span>
          </li>
        </Link>
      </ul>
    </>
  );
}

export default IconList;
