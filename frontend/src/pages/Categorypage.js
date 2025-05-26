import React, { useEffect, useState, useCallback } from "react";
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
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("popularity");
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    categories: [],
    productTypes: [],
    brands: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Memoize path data extraction
  const getPathData = useCallback(() => {
    const pathSegments = location.pathname.split("/").filter((segment) => segment);
    const isBrandPage = pathSegments[1] === "brand";
    
    return isBrandPage
      ? { brand: pathSegments[2]?.replace(/-/g, " ") || null }
      : {
          category: pathSegments[1] ? pathSegments[1].replace(/-/g, " ") : null,
          subcategory: pathSegments[2] ? pathSegments[2].replace(/-/g, " ") : null,
          type: pathSegments[3] ? pathSegments[3].replace(/-/g, " ") : null,
        };
  }, [location.pathname]);

  const [pathData, setPathData] = useState(getPathData());
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Update path data and filters when URL changes
  useEffect(() => {
    const newPathData = getPathData();
    setPathData(newPathData);
    
    // Initialize filters based on URL
    if (newPathData.brand) {
      setSelectedBrands([newPathData.brand].filter(Boolean));
      setSelectedDepartments([]);
      setSelectedCategories([]);
      setSelectedProductTypes([]);
    } else {
      setSelectedDepartments([newPathData.category].filter(Boolean));
      setSelectedCategories([newPathData.subcategory].filter(Boolean));
      setSelectedProductTypes([newPathData.type].filter(Boolean));
      setSelectedBrands([]);
    }
  }, [location.pathname, getPathData]);

  // Fetch filter options (runs once on mount)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        const products = response.data.products || []; // Access the products array

        setFilterOptions({
          departments: [...new Set(products.map((p) => p.category))].filter(Boolean),
          categories: [...new Set(products.map((p) => p.subcategory))].filter(Boolean),
          productTypes: [...new Set(products.map((p) => p.type))].filter(Boolean),
          brands: [...new Set(products.map((p) => p.brand))].filter(Boolean),
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch products with debounce and cancellation
  useEffect(() => {
    const isBrandPage = location.pathname.includes("/brand");
    let isMounted = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = isBrandPage
          ? { brand: selectedBrands.join(",") || pathData.brand }
          : {
              category: selectedDepartments.join(",") || pathData.category,
              subcategory: selectedCategories.join(",") || pathData.subcategory,
              type: selectedProductTypes.join(",") || pathData.type,
              brand: selectedBrands.join(","),
            };

        const response = await axios.get("http://localhost:5000/api/products", {
          params: Object.fromEntries(Object.entries(params).filter(([_, v]) => v)),
          signal: controller.signal,
        });

        if (isMounted) {
          // Access the products array from the response data
          const productsData = response.data.products || [];
          
          let sortedProducts = [...productsData];
          if (sortOption === "lowToHigh") {
            sortedProducts.sort((a, b) => a.price - b.price);
          } else if (sortOption === "highToLow") {
            sortedProducts.sort((a, b) => b.price - a.price);
          } else if (sortOption === "newest") {
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }
          setProducts(sortedProducts);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && isMounted) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300); // Debounce for 300ms

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [
    selectedDepartments,
    selectedCategories,
    selectedProductTypes,
    selectedBrands,
    sortOption,
    pathData,
  ]);

  const isBrandPage = location.pathname.includes("/brand");

  return (
    <Box sx={{ mt: 20, px: 4 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }} align="center">
            {isBrandPage
              ? pathData.brand || "Brand Products"
              : pathData.type || pathData.subcategory || pathData.category || "Products"}
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
              renderInput={(params) => <TextField {...params} label="Department" size="small" />}
              sx={{ mb: 2 }}
disabled            />

            <Autocomplete
              multiple
              options={filterOptions.categories}
              getOptionLabel={(option) => option}
              value={selectedCategories}
              onChange={(e, newValue) => setSelectedCategories(newValue)}
              renderInput={(params) => <TextField {...params} label="Category" size="small" />}
              sx={{ mb: 2 }}
             disabled
            />

            <Autocomplete
              multiple
              options={filterOptions.productTypes}
              getOptionLabel={(option) => option}
              value={selectedProductTypes}
              onChange={(e, newValue) => setSelectedProductTypes(newValue)}
              renderInput={(params) => <TextField {...params} label="Product Type" size="small" />}
              sx={{ mb: 2 }}
disabled
            />

          
          </Box>
        </Grid>

        <Grid size={9}>
          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
            {isLoading ? (
              <Typography>Loading products...</Typography>
            ) : products.length > 0 ? (
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