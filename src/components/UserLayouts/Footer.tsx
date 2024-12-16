// src/components/Footer.tsx
import React from 'react';
import './User.Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p>&copy; {new Date().getFullYear()} Fitness Trainer Finder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
