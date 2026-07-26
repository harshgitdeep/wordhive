import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo" style={{ marginBottom: '12px' }}>
            <Link to="/" aria-label="WordHive Home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', height: '57.59px' }}>
              <span style={{ 
                fontFamily: '"Kaushan Script", cursive', 
                fontSize: '32px', 
                color: '#000000',
                lineHeight: '57.59px',
                whiteSpace: 'nowrap'
              }}>
                WordHive
              </span>
            </Link>
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
            <li><a href="https://github.com/harshgitdeep" target="_blank" rel="noopener noreferrer">Contact</a></li>
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
