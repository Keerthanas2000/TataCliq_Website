import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Productitem from "./Productitem";
import {
  Grid,
  Box,
  Typography,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";

function Categorypage() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");

  const categoryData = {
    category: pathSegments[2] ? pathSegments[2].replace(/-/g, " ") : null,
    subcategory: pathSegments[3] ? pathSegments[3].replace(/-/g, " ") : null,
    type: pathSegments[4] ? pathSegments[4].replace(/-/g, " ") : null,
  };

  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("popularity");

  // Filter options
  const departmentOptions = categoryData.category
    ? [categoryData.category]
    : [];
  const categoryOptions = categoryData.subcategory
    ? [categoryData.subcategory]
    : [];
  const productTypeOptions = categoryData.type ? [categoryData.type] : [];

  // Selected filter values
  const [selectedDepartments, setSelectedDepartments] = useState([
    categoryData.category,
  ]);
  const [selectedCategories, setSelectedCategories] = useState([categoryData.subcategory]);
  const [selectedProductTypes, setSelectedProductTypes] = useState([categoryData.type]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};

        if (categoryData.category) params.category = categoryData.category;
        if (categoryData.subcategory)
          params.subcategory = categoryData.subcategory;
        if (categoryData.type) params.type = categoryData.type;

        const response = await axios.get("http://localhost:5000/api/products", {
          params,
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [location]);

  return (
    <Box sx={{ mt: 15, px: 4 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2 }}
            align="center"
          >
            {categoryData.type ||
              categoryData.subcategory ||
              categoryData.category ||
              "Products"}
          </Typography>
        </Grid>

        <Grid size={1}>
          <Typography variant="h6" sx={{ mb: 2 }} align="center">
            sort by :{" "}
          </Typography>
        </Grid>

        <Grid size={3}>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            size="small"
          >
            <MenuItem value="popularity">Popularity</MenuItem>
            <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
            <MenuItem value="highToLow">Price: High to Low</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </Grid>
        <Grid size={3}>
          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filters
            </Typography>

            <Autocomplete
              multiple
              options={departmentOptions}
              disabled
                getOptionLabel={(option) => option?.label || ''}

              value={selectedDepartments}
              onChange={(e, newValue) => setSelectedDepartments(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Department" size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <Autocomplete
              multiple
              options={categoryOptions}
              disabled
                getOptionLabel={(option) => option?.label || ''}

              value={selectedCategories}
              onChange={(e, newValue) => setSelectedCategories(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Category" size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <Autocomplete
              multiple
              options={productTypeOptions}
              disabled

                getOptionLabel={(option) => option?.label || ''}

              value={selectedProductTypes}
              onChange={(e, newValue) => setSelectedProductTypes(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Product Type" size="small" />
              )}
              sx={{ mb: 2 }}
            />
          </Box>
        </Grid>

        <Grid size={9}>
          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
            {products.length > 0 ? (
              <Grid container spacing={2} justifyContent={"space-evenly"}>
                {products.map((prod) => (
                  <Grid size={3}>
                    <Productitem prod={prod} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No products found.</Typography>
            )}
          </Box>
        </Grid>
        {/* Product List */}
      </Grid>
    </Box>
  );
}

export default Categorypage;
