import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          MERN Blog
        </Link>

        <button 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                onClick={closeMenu}
                className={location.pathname === '/' ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/posts" 
                onClick={closeMenu}
                className={location.pathname === '/posts' ? 'active' : ''}
              >
                Posts
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/posts/create" 
                    onClick={closeMenu}
                    className={location.pathname === '/posts/create' ? 'active' : ''}
                  >
                    Create Post
                  </Link>
                </li>
                <li className="nav-user">
                  <div className="user-info">
                    <span>Hello, {user?.username}</span>
                  </div>
                  <div className="user-dropdown">
                    <Link to="/profile" onClick={closeMenu}>Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    onClick={closeMenu}
                    className={location.pathname === '/login' ? 'active' : ''}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    onClick={closeMenu}
                    className={location.pathname === '/register' ? 'active' : ''}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;