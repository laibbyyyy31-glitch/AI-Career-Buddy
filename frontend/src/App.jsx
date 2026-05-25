import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, FileText, Map, MessageSquare, Menu, X, LogOut, User } from 'lucide-react';

// Context Provider
import { DataProvider } from './context/DataContext';

// Firebase Auth
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Pages Import
import Home from './pages/Home';
import Resume from './pages/Resume';
import Roadmap from './pages/Roadmap';
import Interview from './pages/Interview';
import CareerPath from './pages/CareerPath';
import Login from './pages/Login';
import Signup from './pages/Signup';

import './App.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Authentication state monitor karein
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: 'Career Paths', path: '/career-paths', icon: Compass },
    { name: 'Resume Analysis', path: '/resume', icon: FileText },
    { name: 'Learning Roadmap', path: '/roadmap', icon: Map },
    { name: 'Interview Practice', path: '/interview', icon: MessageSquare }
  ];

  return (
    <>
      <nav className="navbar">
        {/* Logo Section */}
        <Link to="/" className="logo-wrapper">
          <div className="logo-icon">
            <Compass size={20} color="white" />
          </div>
          <span className="logo-text">AI Career Buddy</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links-wrapper">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons - Auth State ke hisab se */}
        <div className="nav-buttons">
          {currentUser ? (
            <>
              {/* User Info Display */}
              <div className="user-info" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginRight: '12px',
                padding: '8px 16px',
                backgroundColor: '#fff7ed',
                borderRadius: '10px'
              }}>
                <User size={18} color="#ea580c" />
                <span style={{ 
                  fontWeight: '600', 
                  color: '#ea580c',
                  fontSize: '0.9rem'
                }}>
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="nav-btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="nav-btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} color="#ea580c" />
          ) : (
            <Menu size={24} color="#ea580c" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      <div className={`mobile-menu-panel ${isMobileMenuOpen ? 'active' : ''}`}>
        {/* Logged-in User Info (Mobile) */}
        {currentUser && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff7ed',
            borderRadius: '10px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <User size={32} color="#ea580c" style={{ marginBottom: '8px' }} />
            <p style={{ fontWeight: '600', color: '#ea580c', margin: 0 }}>
              {currentUser.displayName || currentUser.email?.split('@')[0]}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
              {currentUser.email}
            </p>
          </div>
        )}
        
        {/* Mobile Auth Buttons */}
        <div className="mobile-auth-buttons">
          {currentUser ? (
            <button 
              onClick={handleLogout}
              className="nav-btn-secondary"
              style={{ textAlign: 'center', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="nav-btn-secondary"
                style={{ textAlign: 'center', width: '100%' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="nav-btn-primary"
                style={{ textAlign: 'center', width: '100%' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Links */}
        <div className="mobile-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <DataProvider>
      <Router>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/career-paths" element={<CareerPath />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;