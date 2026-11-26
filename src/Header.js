import React from "react";

function Header() {
  return (
    <header className="navbar">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <a href="#home" className="logo" aria-label="Little Lemon home">
        <span aria-hidden="true">🍋</span> LITTLE LEMON
      </a>

      <nav aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#menu">Menu</a>
        <a href="#about">About</a>

        <a href="#booking" className="nav-button">
          Book a Table
        </a>
      </nav>
    </header>
  );
}

export default Header;
