import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          🌍 Dhruv Weather Dashboard
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
