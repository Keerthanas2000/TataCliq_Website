import React, { useState, useEffect, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify"; // Added toast import
import "../App.css";
import tatacliqlogo from "../images/tatacliqlogo.png";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const categoriesTableRef = useRef(null);
  const brandsTableRef = useRef(null);
  const searchRef = useRef(null);

  const cartCounter = useSelector((state) => state.cart.cartCounter);
  const wishlistCount = useSelector(
    (state) => state.wishlist?.items.length || 0
  );

  const placeholderTexts = [
    "Search for Products",
    "Search for Categories",
    "Search for Brands",
  ];
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    placeholderTexts[0]
  );
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeBrand, setActiveBrand] = useState(0);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    categories: [],
    subcategories: [],
    brands: [],
  });
  const [searchError, setSearchError] = useState("");
  const categoriesArray = [
    [
      '<tr><th><a class="category-link" data-path="Womens-Fashion/Ethnic-Wear">Shop All Ethnic Wear</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Womens-Fashion/Ethnic-Wear/Kurtis-and-Kurtas">Kurtis & Kurtas</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Womens-Fashion/Ethnic-Wear/Sarees">Sarees</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Womens-Fashion/Ethnic-Wear/Lehengas">Lehengas</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Womens-Fashion/Ethnic-Wear/Lehengas">Dupattas</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Womens-Fashion/Western-Wear">Shop All Western Wear</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Womens-Fashion/Western-Wear/Tops-and-T-shirts">Tops & T-shirts</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Womens-Fashion/Western-Wear/Dresses">Dresses</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Womens-Fashion/Western-Wear/Jeans">Jeans</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Womens-Fashion/Western-Wear/Shirts">Shirts</a></th></tr>',
    ],
    [
      '<tr><th><a class="category-link" data-path="Mens-Fashion/Clothing">Shop All Clothing</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Mens-Fashion/Clothing/T-shirts">T-shirts</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Mens-Fashion/Clothing/Shirts">Shirts</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Mens-Fashion/Clothing/Jeans">Jeans</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Mens-Fashion/Clothing/Trousers">Trousers</a></th></tr>',
    ],
    [
      '<tr><th><a class="category-link" data-path="Kids-Fashion/Boys-Clothing">Boys Clothing</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Boys-Clothing/Shirts">Shirts</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Boys-Clothing/Jeans-and-Trousers">Jeans & Trousers</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Boys-Clothing/Shorts">Shorts</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Boys-Clothing/Ethnic-Wear">Ethnic Wear</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Kids-Fashion/Girls-Clothing">Girls Clothing</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Girls-Clothing/Tops">Tops</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Girls-Clothing/Dresses">Dresses</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Girls-Clothing/Skirts-and-Shorts">Skirts & Shorts</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Kids-Fashion/Infant-Wear">Infant Wear</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Infant-Wear/0-6-Months">0-6 Months</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Infant-Wear/6-12-Months">6-12 Months</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Infant-Wear/12-24-Months">12-24 Months</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Kids-Fashion/Infant-Wear/Winter-Wear">Winter Wear</a></th></tr>',
    ],
    [
      '<tr><th><a class="category-link" data-path="Home-and-Kitchen/Bath-Linen">Bath Linen</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Bath-Linen/Towels">Towels</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Bath-Linen/Bath-Mats">Bath Mats</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Bath-Linen/Bathrobes">Bathrobes</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Home-and-Kitchen/Kitchen-and-Dining">Kitchen & Dining</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Kitchen-and-Dining/Cookware">Cookware</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Kitchen-and-Dining/Bakeware">Bakeware</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Kitchen-and-Dining/Tableware">Tableware</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Kitchen-and-Dining/Storage">Storage</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Home-and-Kitchen/Home-Decor">Home Decor</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Home-Decor/Lighting">Lighting</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Home-Decor/Wall-Decor">Wall Decor</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Home-Decor/Showpieces">Showpieces</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Home-and-Kitchen/Home-Decor/Plants">Plants</a></th></tr>',
    ],
    [
      '<tr><th><a class="category-link" data-path="Beauty/Skincare">Skincare</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/Skincare/Cleansers">Cleansers</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/Skincare/Moisturizers">Moisturizers</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/Skincare/Masks">Masks</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/Skincare/Eye-Care">Eye Care</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Beauty/haircare">Haircare</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/haircare/Shampoo-and-Conditioner">Shampoo & Conditioner</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/haircare/Hair-Oils">Hair Oils</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/haircare/Styling">Styling</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/haircare/Hair-Color">Hair Color</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Beauty/Fragrance">Fragrance</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/Fragrance/Perfumes">Perfumes</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/Fragrance/Deodorants">Deodorants</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/Fragrance/Body-Mists">Body Mists</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Beauty/Fragrance/Gift-Sets">Gift Sets</a></th></tr>',
    ],
    [
      '<tr><th><a class="category-link" data-path="Gadgets/Audio">Audio</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Gadgets/Audio/Headphones">Headphones</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Gadgets/Audio/Speakers">Speakers</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Gadgets/Audio/Sound-Systems">Sound Systems</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Gadgets/Wearables">Wearables</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Gadgets/wearables/Smartwatches">Smartwatches</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Gadgets/Smart-Home">Smart Home</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Gadgets/Smart-Home/Lighting">Lighting</a></th></tr>',
    ],
    [
      '<tr><th><a class="category-link" data-path="Accessories/Jewellery">Jewellery</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Jewellery/Gold">Gold</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Jewellery/Silver">Silver</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Jewellery/Diamond">Diamond</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Jewellery/Fashion">Fashion</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Accessories/Bags-and-Luggage">Bags & Luggage</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Bags-and-Luggage/Handbags">Handbags</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Bags-and-Luggage/Backpacks">Backpacks</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Bags-and-Luggage/Luggage">Luggage</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Bags-and-Luggage/Wallets">Wallets</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Accessories/Eyewear">Eyewear</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Eyewear/Sunglasses">Sunglasses</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/Eyewear/Eyeglasses">Eyeglasses</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Accessories/Other-Accessories">Other Accessories</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/other-accessories/Watches">Watches</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/other-accessories/Belts">Belts</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Accessories/other-accessories/Hats">Hats</a></th></tr>',
    ],
    [
      '<tr><th><a class="category-link" data-path="Health-and-Wellness/Health-Monitors">Health Monitors</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Health-and-Wellness/Health-Monitors/BP-Monitors">BP Monitors</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Health-and-Wellness/Health-Monitors/Weighing-Scales">Weighing Scales</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Health-and-Wellness/Health-Monitors/Thermometers">Thermometers</a></th></tr>',
      '<tr><th><a class="category-link" data-path="Health-and-Wellness/Nutrition">Nutrition</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Health-and-Wellness/nutrition/Protein">Protein</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Health-and-Wellness/nutrition/Vitamins">Vitamins</a></th></tr>',
      '<tr><th><a class="categorychild-link" data-path="Health-and-Wellness/nutrition/Supplements">Supplements</a></th></tr>',
    ],
  ];

  const brandArray = [
    [
      '<tr><th><a href="#">Popular brands</a></th></tr>',
      '<tr><td><a href="#">Libas</a></td><td></td></tr>',
      '<tr><td><a href="#">W</a></td><td></td></tr>',
      '<tr><td><a href="#">Satrani</a></td><td></td></tr>',
      '<tr><td><a href="#">Aarke</a></td><td></td></tr>',
      '<tr><td><a href="#">Shubkala</a></td><td></td></tr>',
      '<tr><td><a href="#">Zara</a></td><td></td></tr>',
      '<tr><td><a href="#">Style up</a></td><td></td></tr>',
      '<tr><td><a href="#">Zudio</a></td><td></td></tr>',
      '<tr><td><a href="#">Soch</a></td><td></td></tr>',
      '<tr><td><a href="#">Dress India</a></td><td></td></tr>',
      '<tr><td><a href="#">Puma</a></td><td></td></tr>',
      '<tr><td><a href="#">Nike</a></td><td></td></tr>',
    ],
  ];

  useEffect(() => {
    const handleNavigationClick = (e) => {
      const categoryLink = e.target.closest(
        ".category-link, .categorychild-link"
      );
      if (categoryLink) {
        e.preventDefault();
        const path = categoryLink.getAttribute("data-path");
        if (path) {
          navigate(`/category/${path}`);
        }
        return;
      }

      const brandLink = e.target.closest("#brandTable a");
      if (brandLink) {
        e.preventDefault();
        const brandName = brandLink.textContent.trim();
        navigate(
          `/category/brand/${brandName.toLowerCase().replace(/\s+/g, "-")}`
        );
      }
    };

    document.addEventListener("click", handleNavigationClick);
    return () => document.removeEventListener("click", handleNavigationClick);
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => {
        const currentIndex = placeholderTexts.indexOf(prev);
        return placeholderTexts[(currentIndex + 1) % placeholderTexts.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);
    setSearchError("");

    const results = { categories: [], subcategories: [], brands: [] };

    if (query.length >= 2) {
      categoriesArray.forEach((categoryGroup) => {
        categoryGroup.forEach((item) => {
          const text = item.match(/>([^<]+)</)?.[1]?.toLowerCase();
          const path = item.match(/data-path="([^"]+)"/)?.[1];
          if (text?.includes(query) && path) {
            if (item.includes("category-link")) {
              results.categories.push({ text, path });
            } else if (item.includes("categorychild-link")) {
              results.subcategories.push({ text, path });
            }
          }
        });
      });

      brandArray[0].forEach((item) => {
        const match = item.match(/<t[dh][^>]*>([^<]+)</);
        if (match) {
          const text = match[1].toLowerCase().trim();
          if (text && !text.includes("popular brands")) {
            if (text.includes(query)) {
              results.brands.push({ 
                text: text, 
                path: text.replace(/\s+/g, "-") 
              });
            }
          }
        }
      });

      setIsSearchDropdownOpen(
        results.categories.length > 0 ||
        results.subcategories.length > 0 ||
        results.brands.length > 0
      );
      setSearchResults(results);
    } else {
      setIsSearchDropdownOpen(false);
      setSearchResults({ categories: [], subcategories: [], brands: [] });
    }
  };

  const handleSearchBlur = async () => {
    if (!searchQuery.trim()) {
      setIsSearchDropdownOpen(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/products", {
        params: {
          category: searchQuery,
          subcategory: searchQuery,
          type: searchQuery,
          brand: searchQuery,
        },
      });

      const products = response.data.products || [];
      if (products.length === 0) {
        toast.error("No results found for your search.", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsSearchDropdownOpen(false);
        return;
      }

      const firstProduct = products[0];
      let navigationPath = "";

      if (firstProduct.brand.toLowerCase().includes(searchQuery)) {
        navigationPath = `/category/brand/${firstProduct.brand
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
      } else if (firstProduct.type.toLowerCase().includes(searchQuery)) {
        navigationPath = `/category/${firstProduct.category.replace(
          /\s+/g,
          "-"
        )}/${firstProduct.subcategory.replace(
          /\s+/g,
          "-"
        )}/${firstProduct.type.replace(/\s+/g, "-")}`;
      } else if (firstProduct.subcategory.toLowerCase().includes(searchQuery)) {
        navigationPath = `/category/${firstProduct.category.replace(
          /\s+/g,
          "-"
        )}/${firstProduct.subcategory.replace(/\s+/g, "-")}`;
      } else if (firstProduct.category.toLowerCase().includes(searchQuery)) {
        navigationPath = `/category/${firstProduct.category.replace(
          /\s+/g,
          "-"
        )}`;
      }

      if (navigationPath) {
        navigate(navigationPath);
        setSearchQuery("");
        setIsSearchDropdownOpen(false);
      } else {
        toast.error("No matching category, subcategory, type, or brand found.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Error searching products. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSearchNavigation = (type, path) => {
    if (type === "brand") {
      navigate(`/category/brand/${path}`);
    } else {
      navigate(`/category/${path}`);
    }
    setIsSearchDropdownOpen(false);
    setSearchQuery("");
  };

  return (
    <div>
      <ToastContainer /> {/* Added ToastContainer */}
      <div id="navContainer">
        <div></div>
        <div className="navMiddle">
          <div className="logoHolder">
            <img
              onClick={() => navigate("/")}
              style={{ height: "80px", width: "200px" }}
              src={tatacliqlogo}
              alt="tata-cliq_logo"
            />
          </div>
          <div className="navFunctHolder">
            <div className="topMiddleSection">
              <a
                href="https://luxury.tatacliq.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="DesktopHeader__luxeryTab"
              >
                Tata CLiQ Luxury
              </a>
              <div className="topMiddleSection_Menu">
                <div className="loginDropdown">
                  <span
                    id="signInText"
                    className="loginBtn"
                    style={{ cursor: "pointer" }}
                  >
                    {sessionStorage.getItem("userdata")
                      ? JSON.parse(sessionStorage.getItem("userdata")).name
                      : "Sign in/ Sign Up"}
                  </span>
                  <div className="loginDropdown-content">
                    {!sessionStorage.getItem("userdata") && (
                      <button id="loginBtn" onClick={() => navigate("/login")}>
                        Login / Register
                      </button>
                    )}
                    <p>
                      <a
                        href="#"
                        onClick={() => navigate("/viewprofile")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-regular fa-user"></i> My Account
                      </a>
                    </p>
                    <p>
                      <a href="#">
                        <i className="fa-solid fa-bag-shopping"></i> Alerts/
                        Coupons
                      </a>
                    </p>
                    <p id="logOut">
                      <a
                        href="#"
                        onClick={() => {
                          sessionStorage.clear();
                          navigate("/");
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bi bi-box-arrow-left"></i> Log Out
                      </a>
                    </p>
                  </div>
                </div>
                <div>
                  <Link className="topMenu" to="/cliqcashwallet">
                    Track Orders
                  </Link>
                </div>
                <div>
                  <Link className="topMenu" to="/ClicKCare">
                    CLiQ Care
                  </Link>
                </div>
                <div>
                  <Link className="topMenu" to="/giftcard">
                    GiftCard
                  </Link>
                </div>
                <div>
                  <Link className="topMenu" to="/cliqcashwallet">
                    CLiQ Cash
                  </Link>
                </div>
              </div>
            </div>
            <div className="bottomMiddleSection">
              <div>
                <div
                  className="dropdown"
                  onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                >
                  <span className="dropbtn cat" style={{ fontSize: "17px" }}>
                    Categories{" "}
                    <i
                      className="fa-solid fa-angle-down navbarArrowDown"
                      style={{
                        transform: isCategoryDropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        padding: isCategoryDropdownOpen ? "5px" : "0",
                      }}
                    ></i>
                  </span>
                  {isCategoryDropdownOpen && (
                    <div className="dropdown-content">
                      <div id="blockshowCat">
                        <div id="listCat">
                          {[
                            {
                              id: "navWomen",
                              text: "Women's Fashion",
                              index: 0,
                            },
                            { id: "navMen", text: "Men's Fashion", index: 1 },
                            { id: "navKids", text: "Kid's Fashion", index: 2 },
                            {
                              id: "navHome",
                              text: "Home and Kitchen",
                              index: 3,
                            },
                            { id: "navBeauty", text: "Beauty", index: 4 },
                            {
                              id: "navHealth",
                              text: "Health and Wellness",
                              index: 5,
                            },
                            {
                              id: "navAccessories",
                              text: "Accessories",
                              index: 6,
                            },
                            { id: "navGadgets", text: "Gadgets", index: 7 },
                          ].map((item) => (
                            <React.Fragment key={item.id}>
                              <a
                                id={item.id}
                                href="#"
                                onMouseEnter={() =>
                                  setActiveCategory(item.index)
                                }
                                style={{
                                  color:
                                    activeCategory === item.index
                                      ? "black"
                                      : "gray",
                                  textDecoration: "none",
                                }}
                              >
                                {item.text}
                                <span
                                  style={{
                                    display:
                                      activeCategory === item.index
                                        ? "inline-block"
                                        : "none",
                                    marginLeft: "5px",
                                  }}
                                >
                                  ›
                                </span>
                              </a>
                              <hr
                                style={{ margin: "8px 0", borderColor: "#eee" }}
                              />
                            </React.Fragment>
                          ))}
                        </div>
                        <div>
                          <table
                            id="cateTable"
                            ref={categoriesTableRef}
                            dangerouslySetInnerHTML={{
                              __html:
                                categoriesArray[activeCategory]?.join("") || "",
                            }}
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              marginTop: "10px",
                            }}
                          ></table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="dropdown" // Changed from dropdown_Br to dropdown for consistency
                  onMouseEnter={() => setIsBrandDropdownOpen(true)}
                  onMouseLeave={() => setIsBrandDropdownOpen(false)}
                >
                  <span
                    className="dropbtn cat" // Changed from dropbtn_Br to dropbtn cat for consistent styling
                    style={{ fontSize: "17px" }}
                  >
                    Brands{" "}
                    <i
                      className="fa-solid fa-angle-down navbarArrowDown"
                      style={{
                        transform: isBrandDropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        padding: isBrandDropdownOpen ? "5px" : "0",
                      }}
                    ></i>
                  </span>
                  {isBrandDropdownOpen && (
                    <div className="dropdown-content"> {/* Changed from dropdown-content_Br to dropdown-content */}
                      <div id="blockshow">
                        <table
                          id="brandTable"
                          ref={brandsTableRef}
                          cellPadding="0"
                          dangerouslySetInnerHTML={{
                            __html: brandArray[activeBrand]?.join("") || "",
                          }}
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "10px",
                          }}
                        ></table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="search-container" ref={searchRef}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-magnifying-glass"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsSearchDropdownOpen(!!searchQuery)}
                  ></i>
                  <input
                    type="text"
                    placeholder={currentPlaceholder}
                    value={searchQuery}
                    onChange={handleSearch}
                    onBlur={handleSearchBlur}
                    onClick={() => setIsSearchDropdownOpen(!!searchQuery)}
                    style={{
                      marginLeft: "8px",
                      width: "300px",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                {isSearchDropdownOpen && searchQuery.length > 2 && (
                  <div
                    className="search-dropdown"
                    style={{
                      position: "absolute",
                      background: "white",
                      border: "1px solid #ddd",
                      height: "700px",
                      overflowY: "auto",
                      width: "500px",
                      zIndex: 1001,
                    }}
                  >
                    {searchError && (
                      <div style={{ padding: "10px", color: "red" }}>
                        {searchError}
                      </div>
                    )}
                    {searchResults.categories.length > 0 && (
                      <>
                        <h6 style={{ padding: "10px", fontWeight: "bold" }}>
                          Categories
                        </h6>
                        {searchResults.categories.map((item, index) => (
                          <div
                            key={item.text + index}
                            onClick={() =>
                              handleSearchNavigation("category", item.path)
                            }
                            style={{
                              padding: "8px 10px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {item.text}
                          </div>
                        ))}
                      </>
                    )}
                    {searchResults.subcategories.length > 0 && (
                      <>
                        <h6 style={{ padding: "10px", fontWeight: "bold" }}>
                          Subcategories
                        </h6>
                        {searchResults.subcategories.map((item, index) => (
                          <div
                            key={item.text + index}
                            onClick={() =>
                              handleSearchNavigation("category", item.path)
                            }
                            style={{
                              padding: "8px 10px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {item.text}
                          </div>
                        ))}
                      </>
                    )}
                    {searchResults.brands.length > 0 && (
                      <>
                        <h6 style={{ padding: "10px", fontWeight: "bold" }}>
                          Brands
                        </h6>
                        {searchResults.brands.map((item, index) => (
                          <div
                            key={item.text + index}
                            onClick={() =>
                              handleSearchNavigation("brand", item.path)
                            }
                            style={{
                              padding: "8px 10px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {item.text}
                          </div>
                        ))}
                      </>
                    )}
                    {searchResults.categories.length === 0 &&
                      searchResults.subcategories.length === 0 &&
                      searchResults.brands.length === 0 &&
                      !searchError && (
                        <div style={{ padding: "10px", color: "#777" }}>
                          No results found
                        </div>
                      )}
                  </div>
                )}
              </div>
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <div
                  style={{ cursor: "pointer", position: "relative" }}
                  onClick={() => navigate("/wishlist")}
                >
                  <i
                    className="fa-regular fa-heart"
                    style={{ fontSize: "24px" }}
                  ></i>
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-10px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                    }}
                  >
                    {wishlistCount}
                  </span>
                </div>
                <div
                  style={{ cursor: "pointer", position: "relative" }}
                  onClick={() => navigate("/cart")}
                >
                  <i
                    className="fa-solid fa-bag-shopping"
                    style={{ fontSize: "24px" }}
                  ></i>
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-10px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                    }}
                  >
                    {cartCounter}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Home;