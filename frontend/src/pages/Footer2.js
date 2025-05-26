import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TataCliqBanner = () => {
  return (
    <div className="container-fluid p-4 text-start">
      {/* Download App Header */}
      <div className="d-flex justify-content-end mb-4">
        {/* <button className="btn btn-primary">Download App</button> */}
      </div>

      {/* Main Content with left padding */}
      <div className="mb-5 mx-0 ps-5"> {/* Added ps-5 for left padding */}
        <h5 className="mb-4">Tata CLIQ FASHION: Shop Online with India's most trusted destination</h5>
        
        <p className="mb-4 w-100"> {/* Added w-100 for full width */}
          Genuine products from all the top brands get delivered right to your doorstep. Our sleek, immersive design allows you to easily navigate between categories and brand stores so that you can find a wide selection of xenonenswear, menswear, kidswear, footwear, watches, accessories, footwear, watches and accessories online. You can also check our great offers and get the best prices on various products across lifestyle, fashion, and more.
        </p>

        <h5 className="mb-3">Online Shopping: Fast & convenient with the click of a button</h5>
        <p className="mb-4 w-100">
          The upside of online shopping at Tata CLIQ FASHION online store, is that you'll save on time and most importantly money with Tata Cliq FASHION offers. It's as simple as comparing products and prices online before making the right buy. What's more, you also have the option to pay for your favourite brands and products using our easy EMI options. Of course, you can buy and try - in the convenience of your home. Returns are easy too: We'll pick up your returns for free or you can also drop off the goods at the nearest brand store.
        </p>

        <h5 className="mb-3">Tata CLIQ FASHION Shopping App: Just a few clicks on Android & iOS</h5>
        <div className="mb-4 w-100">
          <p className="w-100">
            Download the Android app from the Play Store or the iOS app from Apple App Store and get set to enjoy a range of benefits. Apart from the best deals, amazing offers and the latest styles online, the app also gives you the flexibility to shop at your convenience. Use the easy share options to share your shopping with your friends and family to ensure you're buying something perfect. With constant updates and a host of new features being introduced constantly, enjoy a shopping experience that you'll love.
          </p>
          <div className="mt-3">
            <a href="https://play.google.com/store/search?q=tatacliq&c=apps&hl=en" className="btn btn-outline-dark me-2">Play Store</a>
            <a href="https://www.apple.com/in/search/tatcliq?src=globalnav" className="btn btn-outline-dark">App Store</a>
          </div>
        </div>

        <h5 className="mb-3">Tata CLIQ FASHION: The most genuine place for Fashion and Lifestyle</h5>
        <p className="mb-4 w-100">
          With an exclusive Brand Store for Westside Online we have most of your trendy shopping needs taken care of. Make Tata CLIQ FASHION your online shopping destination and get the best deals on your favourite brands, with 100% genuine products. Be it jewellery or makeup, you can count on Tata CLIQ FASHION for receiving only the most authentic products.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mt-5">
        <p>© 2025 Tata CLIQ | All rights reserved</p>
      </div>
    </div>
  );
};

export default TataCliqBanner;