import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Box, IconButton, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import {
  addToWishlist,
  removeFromWishlist,
  addTocart,
  removeProd,
} from "../actions/CartActions";

function Productitem(props) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(
    (item) => item._id === props.prod._id
  );

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(props.prod));
    } else {
      dispatch(addToWishlist(props.prod));
    }
  };
const cartItems = useSelector((state) => state.cart.cartItems);
const isCarted = cartItems?.some((item) => item._id === props.prod._id);
  const handleCartToggle = () => {
    if (isCarted) {
      dispatch(removeProd(props.prod));
    } else {
      dispatch(addTocart(props.prod));
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        mb: 3,
        boxShadow: 2,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <img
          style={{
            height: "50vh",
            width: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          src={props.prod.images[0]}
          alt={props.prod.title}
        />

        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <IconButton
            sx={{
              bgcolor: "white",
              "&:hover": { bgcolor: "#f5f5f5" },
              color: isWishlisted ? "rgb(197, 137, 151);" : "inherit",
            }}
            size="small"
            onClick={handleWishlistToggle}
          >
            <FavoriteIcon
              fontSize="small"
              sx={{ color: isWishlisted ? "rgb(189, 16, 56);" : "inherit" }}
            />
          </IconButton>
<IconButton
  onClick={handleCartToggle}
  sx={{
    bgcolor: "white",
    "&:hover": { bgcolor: "#f5f5f5" },
    color: isCarted ? "rgb(197, 137, 151)" : "inherit",
  }}
>
  <ShoppingBagIcon
    fontSize="small"
    sx={{ color: isCarted ? "rgb(189, 16, 56)" : "inherit" }}
  />
</IconButton>
        </Box>
      </Box>

      <Box sx={{ mt: 1, mb: 10, px: 1 }}>
        <Typography fontWeight={600}>{props.prod.brand}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {props.prod.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography fontWeight={600}>₹{props.prod.price}</Typography>
          <Typography
            variant="body2"
            sx={{ textDecoration: "line-through", color: "grey.600" }}
          >
            ₹{props.prod.price + 100}
          </Typography>
          <Typography variant="body2" color="green">
            10% off
          </Typography>

          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
          >
            <Typography
              variant="body2"
              sx={{
                bgcolor: "green",
                color: "white",
                px: 0.5,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "2px",
                fontSize: "12px",
              }}
            >
              4.1 <StarIcon sx={{ fontSize: "14px" }} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Productitem;
