import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginBottom: '12px' }}>
            <img
              src="/assets/wordhive_logo.svg"
              alt="WordHive Logo"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: '800', color: '#1E293B', fontSize: '1.25rem', letterSpacing: '-0.5px', marginLeft: '8px' }}>Word</span>
            <span style={{ fontWeight: '800', color: '#F59E0B', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>Hive</span>
          </div>
          <p className="footer-desc">
            A modern publishing platform inspired by the intelligence of bees and the power of shared knowledge.
          </p>
        </div>

        <div className="footer-column">
          <h4>Product</h4>
          <ul>
            <li><Link to="/">Explore Stories</Link></li>
            <li><Link to="/create">Write Story 🐝</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/about">About the Hive</Link></li>
            <li><Link to="/contact">Support</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Connect</h4>
          <ul>
            <li>
              <a href="https://github.com/harshgitdeep/wordhive" target="_blank" rel="noopener noreferrer">
                Source Code
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/harshdeepsingh-/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} WordHive. All rights reserved. Made with 🍯 and 🐝 by{" "}
          <a href="https://github.com/harshgitdeep" target="_blank" rel="noopener noreferrer">
            @harshgitdeep
          </a>.
        </p>
      </div>
    </footer>
  );
}
