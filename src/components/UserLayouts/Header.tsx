import React, { useState, useRef, useEffect } from 'react';
import './User.Header.scss';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { logoutUser } from '../../features/user/services/userService';
// import { logout } from '../../redux/slices/userSlice'; // Adjust import path as needed

const Header: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [activeLink, setActiveLink] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Determine active link based on current path
 
  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
   dispatch(logoutUser())
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link 
          to="/" 
          className="header__logo-link"
        >
          <span className="logo-text">CoachHub</span>
        </Link>
      </div>
      
      <nav className="header__nav">
        {[
          { path: '/', label: 'Home', key: 'home' },
          { path: '/trainers', label: 'Trainers', key: 'trainers' },
          { path: '/about', label: 'About', key: 'about' }
        ].map(({ path, label, key }) => (
          <Link 
            key={key}
            to={path} 
            className={`header__nav-link ${activeLink === key ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      
      <div className="header__auth">
        {user ? (
          <div className="header__auth__profile-dropdown" ref={profileMenuRef}>
            <button 
              className="header__auth-button" 
              onClick={toggleProfileMenu}
            >
              Profile
              <i className="fa fa-chevron-down"></i> {/* Assuming Font Awesome is used */}
            </button>
            
            <div 
              className={`profile-menu ${isProfileMenuOpen ? 'open' : ''}`}
            >
              <Link to="/profile" className="header__auth-button">
                My Profile
              </Link>
              <Link to="/settings" className="header__auth-button">
                Settings
              </Link>
              <button 
                className="header__auth-button header__auth-button--logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className="header__auth-button header__auth-button--login">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="header__auth-button header__auth-button--register">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;