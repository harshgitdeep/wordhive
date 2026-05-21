import { Link } from "react-router-dom";
import "./App.css";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto">
        <div className="flex flex-col justify-center items-center space-y-2">
          <p className="text-gray-600 text-sm">
            &copy; 2026 WordHive. All rights reserved. Made by{" "}
            <a href="https://github.com/harshgitdeep" target="_blank">
              <i>@harshgitdeep</i>
            </a>
            .
          </p>
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
        <Link to="/">Home</Link>
      </li>
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
        <a
          href="https://github.com/harshgitdeep/wordhive"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
      </li>
      <li>
        <a
          href="https://www.linkedin.com/in/harshdeepsingh-/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Linkedin
        </a>
      </li>
    </ul>
  );
}
