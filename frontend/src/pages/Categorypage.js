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
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    categories: [],
    productTypes: [],
  });
  const [selectedDepartments, setSelectedDepartments] = useState(
    categoryData.category ? [categoryData.category] : []
  );
  const [selectedCategories, setSelectedCategories] = useState(
    categoryData.subcategory ? [categoryData.subcategory] : []
  );
  const [selectedProductTypes, setSelectedProductTypes] = useState(
    categoryData.type ? [categoryData.type] : []
  );

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setFilterOptions({
          departments: response.data.categories || [],
          categories: response.data.subcategories || [],
          productTypes: response.data.types || [],
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          category: selectedDepartments.join(",") || categoryData.category,
          subcategory: selectedCategories.join(",") || categoryData.subcategory,
          type: selectedProductTypes.join(",") || categoryData.type,
        };

        const response = await axios.get("http://localhost:5000/api/products", {
          params,
        });
        
        let sortedProducts = [...response.data];
        if (sortOption === "lowToHigh") {
          sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "highToLow") {
          sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sortOption === "newest") {
          sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        // "popularity" is default, no sorting needed
        
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [
    selectedDepartments,
    selectedCategories,
    selectedProductTypes,
    sortOption,
    location,
    categoryData.category,
    categoryData.subcategory,
    categoryData.type,
  ]);


  return (
    <Box sx={{ mt: 20, px: 4 }}>
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
            Sort by:
          </Typography>
        </Grid>

        <Grid size={3}>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            size="small"
            fullWidth
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
              options={filterOptions.departments}
              getOptionLabel={(option) => option}
              value={selectedDepartments}
              onChange={(e, newValue) => setSelectedDepartments(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Department" size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <Autocomplete
              multiple
              options={filterOptions.categories}
              getOptionLabel={(option) => option}
              value={selectedCategories}
              onChange={(e, newValue) => setSelectedCategories(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Category" size="small" />
              )}
              sx={{ mb: 2 }}
            />

            <Autocomplete
              multiple
              options={filterOptions.productTypes}
              getOptionLabel={(option) => option}
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
              <Grid container spacing={2} justifyContent="space-evenly">
                {products.map((prod) => (
                  <Grid size={3} key={prod._id}>
                    <Productitem prod={prod} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No products found.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Categorypage;