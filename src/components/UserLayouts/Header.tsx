// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './User.Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">
          <Link to="/">CoachHub</Link>
        </h1>
        <nav className="header__nav">
          <Link to="/" className="header__link">Home</Link>
          <Link to="/trainers" className="header__link">Trainers</Link>
          <Link to="/about" className="header__link">About</Link>
        </nav>
        <div className="header__actions">
          <Link to="/login" className="header__button header__button--login">Login</Link>
          <Link to="/signup" className="header__button header__button--register">Register</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
