import Footercash from './Footercash';
import Footer2 from './Footer2';
import React from 'react';

function ClickCare() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      <div style={{ display: 'flex', margin: '20px', flex: 1 }}>
        <Sidebar />
        <MainContent />
      </div>

      <Footercash />
      <Footer2 />
    </div>
  );
}

function Sidebar() {
  const styles = {
    sidebar: {
      width: '248px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    },
    heading: {
      marginTop: 0,
      color: '#333'
    },
    topic: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 0',
      width: '200px',
    },
    icon: {
      width: '24px',
      height: '24px',
      marginRight: '15px',
      color: '#666',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      flex: 1,
    },
    title: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
    },
    description: {
      fontSize: '12px',
      color: '#666',
    },
  };

  const topics = [
    { icon: '🛍️', title: 'SHOPPING', description: 'Place order, payment types, delivery modes, etc.' },
    { icon: '%', title: 'OFFERS & PROMOTIONS', description: 'Deals & offers, redeem offer & coupon, etc.' },
    { icon: '💳', title: 'PAYMENTS', description: 'Payment options, COD, UPI, EMI payments, etc.' },
    { icon: '📋', title: 'ORDERS', description: 'Manage your orders, order status, etc.' },
    { icon: '👤', title: 'MANAGE YOUR ACCOUNT', description: 'Create account, password reset, etc.' },
    { icon: '🚚', title: 'SHIPPING & DELIVERY', description: 'Track order, shipping charge, delivery issues, etc.' }
  ];

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.heading}>ALL HELP TOPICS</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {topics.map((topic, index) => (
          <li key={index} style={{ margin: '15px 0' }}>
            <div style={styles.topic}>
              <span style={styles.icon}>{topic.icon}</span>
              <div style={styles.text}>
                <div style={styles.title}>{topic.title}</div>
                <div style={styles.description}>{topic.description}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MainContent() {
  return (
    <div style={{ flex: 1, marginLeft: '20px',marginTop: '100px' }}> 
      <CliqCare />
      <RecentOrders />
      <OtherIssues />
    </div>
  );
}

function CliqCare() {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      height: '280px'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px' }}>CLiQ Care</h1>
        <p style={{ margin: '5px 0 0', color: '#666' }}>YOUR ONE STOP SOLUTION CENTER. We are happy to help you.</p>
      </div>
      <img 
        src="https://www.tatacliq.com/src/account/components/img/cliqCare.svg" 
        alt="Support Illustration" 
        style={{ width: '250px' }} 
      />
    </div>
  );
}

function RecentOrders() {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      marginTop: '20px',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between' }}>
        RECENT ORDERS
        <a href="#" style={{ color: '#ff4081', textDecoration: 'none' }}>VIEW ALL</a>
      </h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
        <div>
          <p style={{ margin: 0, color: '#666' }}>Coscon Unisex Sandals</p>
          <p style={{ margin: 0, color: '#666' }}>Order status: <span style={{ color: '#28a745' }}>Delivered</span></p>
          <p style={{ margin: 0, color: '#666' }}>Delivered on 16 Oct, 2024</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
        <div>
          <p style={{ margin: 0, color: '#666' }}>Puma Active Tricot Black Slim ...</p>
          <p style={{ margin: 0, color: '#666' }}>Order status: <span style={{ color: '#dc3545' }}>Order Cancelled</span></p>
          <p style={{ margin: 0, color: '#666' }}>Cancelled on 13 Oct 2024</p>
        </div>
      </div>
    </div>
  );
}

function OtherIssues() {
  const buttonsData = [
    { icon: '📦', text: 'Product related', url: 'https://www.tatacliq.com/my-account/cliq-care' },
    { icon: '🌐', text: 'Website related', url: 'https://www.tatacliq.com/my-account/cliq-care' },
    { icon: '🛒', text: 'Selling', url: 'https://www.tatacliq.com/my-account/cliq-care' },
    { icon: '🛍️', text: 'Buying', url: 'https://www.tatacliq.com/my-account/cliq-care' },
    { icon: '🎁', text: 'Promotions & Offers', url: 'https://www.tatacliq.com/my-account/cliq-care' },
    { icon: '💳', text: 'EGV/ CLiQ POINT', url: 'https://www.tatacliq.com/my-account/cliq-care' },
  ];

  return (
    <div style={{
      width: '1200px',
      margin: '20px auto 0',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333' }}>Other Issues</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        {buttonsData.map((button, index) => (
          <button
            key={index}
            style={{
              backgroundColor: '#ffe6e6',
              border: 'none',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#333',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffd6d6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffe6e6'}
            onClick={() => window.open(button.url, '_blank')}
          >
            <span style={{ display: 'block', fontSize: '24px', marginBottom: '10px' }}>
              {button.icon}
            </span>
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
}



export default ClickCare;