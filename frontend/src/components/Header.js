import React, { useState } from "react";
import { slide as Menu } from 'react-burger-menu';
import '../style.css';

export default function Header(props) {

    const [menuOpen, setMenuOpen] = useState(false)
    const [searchText, setSearchtext] = useState("")

    const closeMenu = () => {
      setMenuOpen(false)
    }

    const toggleMenu = () => {
      setMenuOpen(!menuOpen)
    }

    const handleSearchChange = (e) => {
      setSearchtext(e.target.value)
    }

    const submitSearch = (e) => {
      e.preventDefault();
      props.updateSearch(searchText);
    }

    // icons for burger-menu and filter are 'fontawesome'-classes
    return (
      <div className="full-width">
        <div id="header">
          <h1>Raumbelegung</h1>
          <form onSubmit={submitSearch}>
            <div className="searchBar">
              <input
                type="text"
                placeholder="Raumsuche..."
                value={searchText}
                onChange={(e) => handleSearchChange(e)}
              />
              <button type="submit">
                <i className="fa fa-search"></i>
              </button>
            </div>
          </form>
          <button onClick={() => toggleMenu()}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <Menu
          right
          isOpen={menuOpen}
          onStateChange={() => setMenuOpen(menuOpen)}
          customBurgerIcon={false}
          disableAutoFocus
        >
          <button onClick={() => closeMenu()}>Übersicht</button>
          <button onClick={() => closeMenu()}>Belegungen</button>
          <button onClick={() => closeMenu()}>Profil</button>
        </Menu>
      </div>
    );
  }
