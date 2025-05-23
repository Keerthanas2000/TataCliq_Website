import React, { useState , useEffect} from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  CssBaseline,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Swal from "sweetalert2";

const theme = createTheme({
  palette: {
    primary: {
      main: "#C2185B",
    },
  },
});

const categories = [
  "Womens Fashion",
  "Mens Fashion",
  "Kids Fashion",
  "Home and Kitchen",
  "Beauty",
  "Gadgets",
  "Accessories",
  "Health and Wellness",
];

const categorySubcategoryTypeMap = {
  "Womens Fashion": {
    "Ethnic Wear": ["Kurtis and Kurtas", "Sarees", "Lehengas", "Dupattas"],
    "Western Wear": ["Tops and T-shirts", "Dresses", "Jeans", "Shirts"],
  },
  "Mens Fashion": {
    Clothing: ["T-shirts", "Shirts", "Jeans", "Trousers"],
  },
  "Kids Fashion": {
    "Boys Clothing": ["Shirts", "Jeans and Trousers", "Shorts", "Ethnic Wear"],
    "Girls Clothing": ["Tops", "Dresses", "Skirts and Shorts"],
    "Infant Wear": ["0-6 Months", "6-12 Months", "12-24 Months", "Winter Wear"],
  },
  "Home and Kitchen": {
    "Bath Linen": ["Towels", "Bath Mats", "Bathrobes"],
    "Kitchen and Dining": ["Cookware", "Bakeware", "Tableware", "Storage"],
    "Home Decor": ["Lighting", "Wall Decor", "Showpieces", "Plants"],
  },
  Beauty: {
    Skincare: ["Cleansers", "Moisturizers", "Masks", "Eye Care"],
    Haircare: ["Shampoo and Conditioner", "Hair Oils", "Styling", "Hair Color"],
    Fragrance: ["Perfumes", "Deodorants", "Body Mists", "Gift Sets"],
  },
  Gadgets: {
    Audio: ["Headphones", "Speakers", "Sound Systems"],
    Wearables: ["Smartwatches"],
    "Smart Home": ["Lighting"],
  },
  Accessories: {
    Jewellery: ["Gold", "Silver", "Diamond", "Fashion"],
    "Bags and Luggage": ["Handbags", "Backpacks", "Luggage", "Wallets"],
    Eyewear: ["Sunglasses", "Eyeglasses"],
    "Other Accessories": ["Watches", "Belts", "Hats"],
  },
  "Health and Wellness": {
    "Health Monitors": ["BP Monitors", "Weighing Scales", "Thermometers"],
    Nutrition: ["Protein", "Vitamins", "Supplements"],
  },
};

const brands = [
  "Libas",
  "W",
  "Satrani ",
  "Aarke",
  "Shubkala",
  "Zara",
  "Style up",
  "Zudio",
  "Soch",
  "Dress India",
  "Puma",
  "Nike"
  
];

function AddProducts() {
const [productData, setProductData] = useState({
  name: "",
  category: "",
  subcategory: "",
  type: "",
  price: "",
  brand: "",
  images: [""],
  description: "Premium quality product designed for style and comfort. Made with high-quality materials for long-lasting durability. Perfect for everyday use, combining functionality with modern aesthetics. A great addition to your collection that offers excellent value for money",
  sellername: "ABC PVT LTD Bengaluru",
  shipmentIndays: "7",
});

useEffect(() => {
  if (productData.brand || productData.subcategory || productData.type) {
    const generatedName = `${productData.brand || ''} ${productData.subcategory || ''} ${productData.type || ''}`.trim();
    setProductData(prev => ({
      ...prev,
      name: generatedName
    }));
  }
}, [productData.brand, productData.subcategory, productData.type]);

  const [currentSubcategories, setCurrentSubcategories] = useState([]);
  const [currentTypes, setCurrentTypes] = useState([]);

  const handleChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (_, newValue) => {
    setProductData((prev) => ({
      ...prev,
      category: newValue,
      subcategory: "",
      type: "",
    }));
    setCurrentSubcategories(
      newValue ? Object.keys(categorySubcategoryTypeMap[newValue] || {}) : []
    );
    setCurrentTypes([]);
  };

  const handleSubcategoryChange = (_, newValue) => {
    setProductData((prev) => ({
      ...prev,
      subcategory: newValue,
      type: "",
    }));
    setCurrentTypes(
      newValue && productData.category
        ? categorySubcategoryTypeMap[productData.category][newValue] || []
        : []
    );
  };

  const addImageField = () => {
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...productData.images];
    newImages[index] = value;
    setProductData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const removeImageField = (index) => {
    const newImages = productData.images.filter((_, i) => i !== index);
    setProductData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleSubmit = () => {
    const finalData = {
      ...productData,
      images: productData.images.filter((img) => img.trim() !== ""),
      price: Number(productData.price),
      shipmentIndays: Number(productData.shipmentIndays),
    };

    axios
      .post("http://localhost:5000/api/products/createProducts", finalData)
      .then((response) => {
        console.log("Product Created Successfully", response.data);
        Swal.fire({
          title: "Product Created Successfully",
          icon: "success",
        });
        setProductData({
          name: "",
          category: "",
          subcategory: "",
          type: "",
          price: "",
          brand: "",
          images: [""],
          // description: "",
          // sellername: "",
          // shipmentIndays: "",
        });
        setCurrentSubcategories([]);
        setCurrentTypes([]);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error in creating product",
          icon: "error",
        });
        console.error("Error in creating product", error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 1, mx: "auto", mt:20 }}>
        <Typography variant="h5" color="primary">
          Add Product
        </Typography>
        <br />
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" color="primary">
              Product details
            </Typography>{" "}
          </Grid>{" "}
          <Grid size={5}>
            <Autocomplete
              fullWidth
              options={Array.isArray(categories) ? categories : []}
              value={productData.category}
              onChange={handleCategoryChange}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) =>
                  option.toLowerCase().includes(inputValue.toLowerCase())
                )
              }  getOptionLabel={(option) => option?.label || ''}

              renderInput={(params) => (
                <TextField {...params} label="Category" color="primary" />
              )}
            />
          </Grid>
          <Grid size={5}>
            <Autocomplete
              fullWidth
                getOptionLabel={(option) => option?.label || ''}

              options={
                Array.isArray(currentSubcategories) ? currentSubcategories : []
              }
              value={productData.subcategory}
              onChange={handleSubcategoryChange}
              disabled={!productData.category}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) =>
                  option.toLowerCase().includes(inputValue.toLowerCase())
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Subcategory" color="primary" />
              )}
            />
          </Grid>
          <Grid size={5}>
            <Autocomplete
              options={Array.isArray(currentTypes) ? currentTypes : []}
                getOptionLabel={(option) => option?.label || ''}

              value={productData.type}
              onChange={(_, newValue) => handleChange("type", newValue)}
              disabled={!productData.subcategory}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) =>
                  option.toLowerCase().includes(inputValue.toLowerCase())
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Type" color="primary" />
              )}
            />
          </Grid>
          <Grid size={5}>
            <Autocomplete
              options={brands}
              freeSolo
              value={productData.brand}
              onChange={(_, newValue) => handleChange("brand", newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Brand" color="primary" />
              )}
              fullWidth
            />
          </Grid>
          <Grid size={5}>
            <TextField
              label="Product Name"
              fullWidth
              color="primary"
              value={productData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              label="Price (₹)"
              fullWidth
              color="primary"
              type="number"
              value={productData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </Grid>{" "}
          <Grid size={2}>
            <TextField
              label="Shipment (in Days)"
              fullWidth
              color="primary"
              type="number"
              value={productData.shipmentIndays}
              onChange={(e) => handleChange("shipmentIndays", e.target.value)}
            />
          </Grid>
          <Grid size={10}>
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              color="primary"
              value={productData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  alignItems: "flex-start",
                },
              }}
            />
          </Grid>
          <Grid size={6}>
            <Typography variant="h6" sx={{ mt: 4 }} color="primary">
              Product Images
            </Typography>{" "}
          </Grid>{" "}
          <Grid size={6}>
            {" "}
            <Button
              startIcon={<AddIcon />}
              onClick={addImageField}
              variant="outlined"
              sx={{ mt: 4 }}
            >
              Add Image
            </Button>{" "}
          </Grid>
          {productData.images.map((img, index) => (
            <>
              <Grid size={6}>
                <TextField
                  label={`Image url ${index + 1}`}
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  fullWidth
                  color="primary"
                />{" "}
              </Grid>
              <Grid size={6}>
                {" "}
                <IconButton
                  color="error"
                  onClick={() => removeImageField(index)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>{" "}
              </Grid>
            </>
          ))}
          <Grid size={12}>
            <Typography variant="h5" color="primary">
              Seller details
            </Typography>{" "}
          </Grid>
          <Grid size={6}>
            <TextField
              label="Seller Name"
              fullWidth
              color="primary"
              value={productData.sellername}
              onChange={(e) => handleChange("sellername", e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, py: 1.5, px: 3 }}
              size="large"
              onClick={handleSubmit}
            >
              Save Product
            </Button>{" "}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default AddProducts;