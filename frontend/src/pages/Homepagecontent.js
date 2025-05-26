import React from "react";
import { 
  Container,
  Box,
  Link,
  Stack,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper
} from "@mui/material";
import {
  Verified,
  AssignmentReturn,
  Payment
} from "@mui/icons-material";
import Carousel from "./Carousel";
import lighning from "../images/lighning.png";

function Homepagecontent() {
  const images = [
    "https://assets.tatacliq.com/medias/sys_master/images/65244458582046.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244458647582.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244458713118.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244458909726.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244458975262.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244459040798.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244459106334.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244459597854.png",
  ];

  const Dealsimages = [
    "https://assets.tatacliq.com/medias/sys_master/images/65236469383198.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469448734.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469514270.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469579806.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469645342.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469710878.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469776414.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469841950.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469907486.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469973022.jpg",
  ];

  const handleCardClick = (imageUrl, index) => {
    console.log(`Card ${index + 1} clicked: ${imageUrl}`);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        marginTop={15}
        justifyContent="center"
        alignItems="center"
      >
        <Grid size={12} margin={2}>
          <Carousel />{" "}
        </Grid>{" "}
        <Grid size={12} margin={2}>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "auto",
              padding: "1rem",
            }}
          >
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="hover-card"
                onClick={() => handleCardClick(imageUrl, index)}
                style={{
                  width: "200px",
                  height: "150px",
                  marginRight: "1rem",
                  overflow: "hidden",
                  border: "none",
                  borderRadius: "18px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <img
                  src={imageUrl}
                  alt={`Card ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/64684496584734.jpg"
                alt="Image 1"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>{" "}
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/65199475851294.jpg"
                alt="Image 3"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/65199475785758.jpg"
                alt="Image 2"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/64684495831070.jpg"
                alt="Image 4"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/64684495831070.jpg"
                alt="Image 4"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>
          </div>

          <div
            style={{
              paddingTop: "30px",
              paddingBottom: "20px",
              textAlign: "center",
            }}
          >
            <img
              src={lighning}
              style={{
                width: "50%",
                height: "80px",
              }}
            />{" "}
          </div>

          <style>{`
        .hover-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>
        </Grid>{" "}
        {Dealsimages.map((imageUrl, index) => (
          <Grid size={6} key={index} justifyContent={"center"}>
            <Card
              className="hover-card"
              onClick={() => handleCardClick(imageUrl, index)}
              style={{
                width: "80%",
                height: "400px",
                margin: "10%",
                borderRadius: "8px",
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
              }}
            >
              <img
                src={imageUrl}
                alt={`Deal ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Card>
          </Grid>
        ))}


      <Box sx={{ bgcolor: 'background.paper', py: 5 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            <Box component="span" sx={{ color: 'text.primary' }}>TATA</Box>
            <Box component="span" sx={{ mx: 0.5 }}>🤝</Box>
            TRUST
          </Typography>

          <Card sx={{ 
            mt: 5,
            borderRadius: '16px',
            boxShadow: 3,
            background: 'linear-gradient(to right, #fff5f7, #ffffff)'
          }}>
            <CardContent>
              <Grid container spacing={20} justifyContent="center" textAlign="center"> 
                <Grid item xs={12} sm={4}>
                  <Verified sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography fontWeight="medium">Authentic</Typography>
                  <Typography>Brands</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <AssignmentReturn sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography fontWeight="medium">Easy</Typography>
                  <Typography>Returns</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Payment sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography fontWeight="medium">Easy</Typography>
                  <Typography>Payments</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={26} justifyContent="center">
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Tata MarketPlace
            </Typography>
            <Stack spacing={1}>
              {[
                { text: 'About Us', href: 'https://www.tatacliq.com/aboutus' },
                { text: 'Careers', href: 'https://www.tatacliq.com/careers' },
                { text: 'Terms of Use', href: 'https://www.tatacliq.com/terms-of-use' },
                { text: 'Privacy Policy', href: 'https://example.com/privacy.jpg' },
                { text: 'Affiliates', href: 'https://example.com/affiliates.jpg' },
                { text: 'Sitemap', href: 'https://example.com/sitemap.jpg' }
              ].map((item, index) => (
                <Link 
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="none"
                >
                  {item.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Customer Service
            </Typography>
            <Stack spacing={1}>
              {[
                { text: 'Shopping', href: 'https://www.tatacliq.com/shopping-faq' },
                { text: 'Offers & Promotions', href: 'https://www.tatacliq.com/offers-promotion-faq' },
                { text: 'Payments', href: 'https://www.tatacliq.com/payments-faq' },
                { text: 'Cancellation', href: 'https://example.com/cancellation.jpg' },
                { text: 'Returns & Refunds', href: 'https://example.com/returns.jpg' },
                { text: 'CliQ And PiQ', href: 'https://example.com/cliqandpiq.jpg' },
                { text: 'Returns Policy', href: 'https://example.com/returnspolicy.jpg' },
                { text: 'Electronics Return Policy', href: 'https://example.com/electronicsreturn.jpg' }
              ].map((item, index) => (
                <Link 
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="none"
                >
                  {item.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              My Tata CLiQ
            </Typography>
            <Stack spacing={1}>
              <Link href="/TrackOrder" color="inherit" underline="none">
                My Orders
              </Link>
              <Link href="/cart" color="inherit" underline="none">
                My Shopping Bag
              </Link>
              <Link href="/wishlist" color="inherit" underline="none">
                My Wishlist
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Tata CLiQ Offerings
            </Typography>
            <Typography variant="body2">
              Watches for Men | Campus Shoes | Sandals for Men | Sneakers for Men | 
              Reebok Shoes | Cotton Kurtis | Woodland Shoes | Jumpsuits | Allen Solly | 
              Sparx Shoes | Gold Rings | Formal Shoes for Men | Sports Shoes for Men | 
              Wallets for Men | Ladies Watches | Trolley Bags | Handbags for Women | 
              Sling Bags for Women | Casual Shoes for Men | Boots for Men | Digital Watches | 
              Sonata Watches | Sneakers for Women | Running Shoes | Puma Shoes | 
              Boots for Women | Skechers | Malabargold | Fabindia | Utsa | Vark | Gia | 
              LOV | Sitemap
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* About Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tata CLIQ FASHION: Shop Online with India's most trusted destination
        </Typography>
        
        <Typography variant="body1" paragraph>
          Genuine products from all the top brands get delivered right to your doorstep. Our sleek, immersive design allows you to easily navigate between categories and brand stores so that you can find a wide selection of xenonenswear, menswear, kidswear, footwear, watches, accessories, footwear, watches and accessories online. You can also check our great offers and get the best prices on various products across lifestyle, fashion, and more.
        </Typography>

        <Typography variant="h5" gutterBottom>
          Online Shopping: Fast & convenient with the click of a button
        </Typography>
        <Typography variant="body1" paragraph>
          The upside of online shopping at Tata CLIQ FASHION online store, is that you'll save on time and most importantly money with Tata Cliq FASHION offers. It's as simple as comparing products and prices online before making the right buy. What's more, you also have the option to pay for your favourite brands and products using our easy EMI options. Of course, you can buy and try - in the convenience of your home. Returns are easy too: We'll pick up your returns for free or you can also drop off the goods at the nearest brand store.
        </Typography>

        <Typography variant="h5" gutterBottom>
          Tata CLIQ FASHION Shopping App: Just a few clicks on Android & iOS
        </Typography>
        <Typography variant="body1" paragraph>
          Download the Android app from the Play Store or the iOS app from Apple App Store and get set to enjoy a range of benefits. Apart from the best deals, amazing offers and the latest styles online, the app also gives you the flexibility to shop at your convenience. Use the easy share options to share your shopping with your friends and family to ensure you're buying something perfect. With constant updates and a host of new features being introduced constantly, enjoy a shopping experience that you'll love.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            color="inherit" 
            href="https://play.google.com/store/search?q=tatacliq&c=apps&hl=en" 
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mr: 2 }}
          >
            Play Store
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            href="https://www.apple.com/in/search/tatcliq?src=globalnav" 
            target="_blank"
            rel="noopener noreferrer"
          >
            App Store
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Tata CLIQ FASHION: The most genuine place for Fashion and Lifestyle
        </Typography>
        <Typography variant="body1" paragraph>
          With an exclusive Brand Store for Westside Online we have most of your trendy shopping needs taken care of. Make Tata CLIQ FASHION your online shopping destination and get the best deals on your favourite brands, with 100% genuine products. Be it jewellery or makeup, you can count on Tata CLIQ FASHION for receiving only the most authentic products.
        </Typography>
      </Container>

      {/* Copyright Footer */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        py: 3,
        textAlign: 'center'
      }}>
        <Typography variant="body2">
          © 2025 Tata CLIQ | All rights reserved
        </Typography>
      </Box>
      </Grid>
    </>
  );
}

export default Homepagecontent;
