// // Footer.jsx

// // 1. Import React library
// import React from 'react';
// // 2. Import styles (create separate Footer.css file)
// import './Footer.css';

// // 3. Create functional component
// const Footer = () => {
//   return (
//     // 4. Main footer container
//     <footer className="footer">
      
//       {/* 5. Header section with logo */}
//       <div className="footer-header">
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
//           </svg>
//           TATA TRUST
//         </span>
//       </div>

//       {/* 6. Top section with features */}
//       <div className="footer-top">
//         {/* Feature 1 */}
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//             <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//           </svg>
//           AUTHENTIC BRANDS
//         </span>

//         {/* Feature 2 */}
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//             <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 0 1-2.47-.56l-2.91 2.91A9.92 9.92 0 0 0 12 22c5.51 0 10-4.49 10-10h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.82.67l2.9-2.9A9.92 9.92 0 0 0 12 2C6.49 2 2 6.49 2 12h3l4 4 4-4h-3z"/>
//           </svg>
//           EASY RETURNS
//         </span>

//         {/* Feature 3 */}
//         <span>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//             <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-12-8h4v4H8v-4z"/>
//           </svg>
//           EASY PAYMENTS
//         </span>
//       </div>

//       {/* 7. Main content columns */}
//       <div className="footer-content">
        
//         {/* Column 1 - Marketplace */}
//         <div className="footer-column">
//           <h3>TATA Marketplace</h3>
//           <ul>
//             <li><a href="#about">About Us</a></li>
//             <li><a href="#careers">Careers</a></li>
//             <li><a href="#terms">Terms of Use</a></li>
//             <li><a href="#privacy">Privacy Policy</a></li>
//             <li><a href="#affiliates">Affiliates</a></li>
//             <li><a href="#sitemap">Sitemap</a></li>
//           </ul>
//         </div>

//         {/* Column 2 - Customer Service */}
//         <div className="footer-column">
//           <h3>Customer Service</h3>
//           <ul>
//             <li><a href="#shopping">Shopping</a></li>
//             <li><a href="#offers">Offers & Promotions</a></li>
//             <li><a href="#payments">Payments</a></li>
//             <li><a href="#cancel">Cancellation</a></li>
//             <li><a href="#returns">Returns & Refunds</a></li>
//             <li><a href="#cliq">CLIQ and PIQ</a></li>
//             <li><a href="#policy">Returns Policy</a></li>
//             <li><a href="#electronics">Electronics Return Policy</a></li>
//             <li><a href="#contact">Contact Us</a></li>
//             <li><a href="#reviews">Reviews Guidelines</a></li>
//           </ul>
//         </div>

//         {/* Column 3 - My Account */}
//         <div className="footer-column">
//           <h3>My Tata CLIQ</h3>
//           <ul>
//             <li><a href="#account">My Account</a></li>
//             <li><a href="#orders">My Orders</a></li>
//             <li><a href="#bag">My Shopping Bag</a></li>
//             <li><a href="#wishlist">My Wishlist</a></li>
//           </ul>
//         </div>

//         {/* Column 4 - Offerings */}
//         <div className="footer-column">
//           <h3>Tata CLIQ Offerings</h3>
//              <ul class="offering-links">
//                     <li><a href="#">Watches for Men</a> <span>|</span> <a href="#">Campus Shoes</a> <span>|</span> <a href="#">Sandals for Men</a> <span>|</span> <a href="#">Sneakers for Men</a></li>
//                     <li><a href="#">Reebok Shoes</a> <span>|</span> <a href="#">Cotton Kurtis</a> <span>|</span> <a href="#">Woodland Shoes</a> <span>|</span> <a href="#">Jumpsuits</a> <span>|</span> <a href="#">Allen Solly</a></li>
//                     <li><a href="#">Sparx Shoes</a> <span>|</span> <a href="#">Gold Rings</a> <span>|</span> <a href="#">Formal Shoes for Men</a> <span>|</span> <a href="#">Sports Shoes for Women</a></li>
//                     <li><a href="#">Wallets for Men</a> <span>|</span> <a href="#">Watches</a> <span>|</span> <a href="#">Trolley Bags</a> <span>|</span> <a href="#">Handbags</a></li>
//                     <li><a href="#">Sling Bags for Women</a> <span>|</span> <a href="#">Casual Shoes for Men</a> <span>|</span> <a href="#">Boots for Men</a> <span>|</span> <a href="#">Digital Watches</a></li>
//                     <li><a href="#">Sonata Watches</a> <span>|</span> <a href="#">Sneakers for Women</a> <span>|</span> <a href="#">Running Shoes</a> <span>|</span> <a href="#">Puma Shoes</a></li>
//                     <li><a href="#">Boots for Women</a> <span>|</span> <a href="#">Sketchers</a> <span>|</span> <a href="#">MalabarGold</a> <span>|</span> <a href="#">Utsa</a> <span>|</span> <a href="#">Vark</a> <span>|</span> <a href="#">Gia</a></li>
//                     <li><a href="#">LOV</a> <span>|</span> <a href="#">Sitemap</a></li>
//                 </ul>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const FooterSection = () => {
  return (
    <div className="bg-light pt-5">
      {/* Trust Banner */}
     <Container
  className="position-relative text-center mb-5"
  style={{ maxWidth: "600px", margin: "0 auto" }}
>
  <div
    className="position-absolute top-0 start-50 translate-middle bg-white px-4 py-2 rounded-pill shadow-sm"
    style={{ zIndex: 2 }}
  >
    <strong>
      <span style={{ color: "#333" }}>TATA</span>{" "}
      <span role="img" aria-label="trust">🤝</span> TRUST
    </strong>
  </div>

  <Card
    className="mt-5 rounded-4 border-0 shadow-sm"
    style={{ background: "linear-gradient(to right, #fff5f7, #ffffff)" }}
  >
    <Card.Body>
      <Row className="text-center">
        <Col md={4}>
          <img src="https://thumbs.dreamstime.com/z/privacy-icon-vector-line-art-outline-shield-user-silhouette-symbol-personal-protection-authentic-sign-authentication-security-128845232.jpg" alt="Authentic Brands" style={{ width: "40px" }} />
          <p className="mb-0 fw-semibold">Authentic</p>
          <p className="mb-0">Brands</p>
        </Col>
        <Col md={4}>
          <img src="https://cdn.vectorstock.com/i/500p/30/78/easy-returns-line-icon-vector-50733078.jpg" alt="Easy Returns" style={{ width: "40px", paddingTop: "10px" }}
 />
          <p className="mb-0 fw-semibold">Easy</p>
          <p className="mb-0">Returns</p>
        </Col>
        <Col md={4}>
          <img src="https://www.shutterstock.com/image-vector/easybills-icon-line-vector-illustration-260nw-2460246329.jpg" alt="Easy Payments" style={{ width: "40px" }} />
          <p className="mb-0 fw-semibold">Easy</p>
          <p className="mb-0">Payments</p>
        </Col>
      </Row>
    </Card.Body>
  </Card>
</Container>


      {/* Footer Links */}
      <Container className="pb-5">
        <Row className="text-start">
 <Col md={3}>
  <h6 className="fw-bold">Tata MarketPlace</h6>
  <a href="https://www.tatacliq.com/aboutus" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
    <p>About Us</p>
  </a>
  <a href="https://www.tatacliq.com/careers" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
    <p>Careers</p>
  </a>
  <a href="https://www.tatacliq.com/terms-of-use" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
    <p>Terms of Use</p>
  </a>
  <a href="https://example.com/privacy.jpg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
    <p>Privacy Policy</p>
  </a>
  <a href="https://example.com/affiliates.jpg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
    <p>Affiliates</p>
  </a>
  <a href="https://example.com/sitemap.jpg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
    <p>Sitemap</p>
  </a>
</Col>



         <Col md={3}>
  <h6 className="fw-bold">Customer Service</h6>
  <a href="https://www.tatacliq.com/shopping-faq" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>Shopping</a><br />
  <a href="https://www.tatacliq.com/offers-promotion-faq" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>Offers & Promotions</a><br />
  <a href="https://www.tatacliq.com/payments-faq" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>Payments</a><br />
  <a href="https://example.com/cancellation.jpg" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>Cancellation</a><br />
  <a href="https://example.com/returns.jpg" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>Returns & Refunds</a><br />
  <a href="https://example.com/cliqandpiq.jpg" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>CliQ And PiQ</a><br />
  <a href="https://example.com/returnspolicy.jpg" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>Returns Policy</a><br />
  <a href="https://example.com/electronicsreturn.jpg" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'none' }}>Electronics Return Policy</a><br />
</Col>


          <Col md={2}>
  <h6 className="fw-bold">My Tata CLiQ</h6>
  <p><a href="/TrackOrder" className="text-decoration-none text-dark">My Orders</a></p>
  <p><a href="/cart" className="text-decoration-none text-dark">My Shopping Bag</a></p>
  <p><a href="/wishlist" className="text-decoration-none text-dark">My Wishlist</a></p>
</Col>

          
        </Row>
      </Container>
    </div>
  );
};

export default FooterSection;
