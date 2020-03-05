import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './style.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      searchText: ""};
  }

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen})
  }

  closeMenu() {
    this.setState({ menuOpen: false})
  }

  toggleMenu() {
    this.setState(state => ({ menuOpen: !state.menuOpen}));
  }

  handleSearchChange(e) {
    this.setState({searchText: e.target.value});
  }

  submitSearch = (e) => {
    e.preventDefault();
    this.props.updateSearch(this.state.searchText);
  }

  render() {
    // icons for burger-menu and filter are 'fontawesome'-classes
    return (
      <div>
        <div id="header">
          <h1>Raumbelegung IT</h1>
          <div className="header-right">
            <form onSubmit={this.submitSearch} onKeyUp={this.handleKeyUp}>
              <input className="searchBar" type="text" placeholder="Raumsuche..." value={this.state.searchText} onChange={(e) => this.handleSearchChange(e)} />
              <button type="submit"><i className="fa fa-search"></i></button>
            </form>
            <button><i className="fas fa-filter"></i></button>
            <button onClick={ () => this.toggleMenu() }><i className="fas fa-bars"></i></button>
          </div>
        </div>
        <Menu
          right
          isOpen={this.state.menuOpen}
          onStateChange={(state) => this.handleStateChange(state)}
          customBurgerIcon={ false }
          disableAutoFocus
          >
          <a onClick={() => this.closeMenu()}>Übersicht</a>
          <a onClick={() => this.closeMenu()}>Belegungen</a>
          <a onClick={() => this.closeMenu()}>Profil</a>
        </Menu>

      </div>
    );
  }
}
