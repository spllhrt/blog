import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Ensure you style the navbar in a separate CSS file


const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">WanderWise</Link>
                <ul className="navbar-menu">
                    <li><Link to="/" className="navbar-item">Home</Link></li>
                    <li><Link to="/about" className="navbar-item">About</Link></li>
                    <li><Link to="/services" className="navbar-item">Services</Link></li>
                    <li><Link to="/contact" className="navbar-item">Contact</Link></li>
                    <li><Link to="/login" className="navbar-item">Login</Link></li>
                </ul>
            </div>
        </nav>
    );
};


export default Navbar;
