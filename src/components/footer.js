import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <p className="mb-0">
        © {new Date().getFullYear()} Dhruv’s Weather App | Built with ❤️ using React & Bootstrap
      </p>
    </footer>
  );
}

export default Footer;
