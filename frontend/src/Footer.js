import { Link } from "react-router-dom";
import "./App.css"; 
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <p className="text-gray-600 text-sm">&copy; 2024 WordHive. All rights reserved. Made by Harshdeep Singh</p>
          <FooterLinks />
        </div>
      </div>
    </footer>
  );
}

function FooterLinks() {
  return (
    <ul>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
      <li>
        <Link to="/terms">Terms of Service</Link>
      </li>
      <li>
        <Link to="/privacy">Privacy Policy</Link>
      </li>
      <li>
      <a href="https://github.com/harshgitdeep/wordhive" target="_blank" rel="noopener noreferrer">Source Code</a>
    </li>
      <li>
      <a href="https://www.linkedin.com/in/harshdeepsingh-/" target="_blank" rel="noopener noreferrer">Linkedin</a>
    </li>
    </ul>
  );
}
