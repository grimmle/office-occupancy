import React from 'react';
import moment from 'moment';

import './style.css';

export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unreservedIsChecked: false,
      hasPCIsChecked: false
    };
  }
  // toggles state of the clicked checkbox (matched by checkbox name)
  toggleChange = (e) => {
    if(e.target.name === "r") {
      this.setState({unreservedIsChecked: !this.state.unreservedIsChecked}, () => {
        this.props.updateFilter(this.checkToggles());
      });
    }
    if(e.target.name === "pc") {
      this.setState({hasPCIsChecked: !this.state.hasPCIsChecked}, () => {
        this.props.updateFilter(this.checkToggles());
      });
    }
  }

  // prepares a object with updated filters to send to App.js
  checkToggles() {
    var filter = {};
    if(this.state.hasPCIsChecked === true) filter.hasPC = true; else filter.hasPC = undefined
    if(this.state.unreservedIsChecked === true) filter.isReserved = false; else filter.isReserved = undefined
    if(this.state.hasPCIsChecked === true && this.state.unreservedIsChecked === true) {
      filter.isReserved = false;
      filter.hasPC = true
    }
    return filter;
  }

  // resets all filters
  handleResetFilter = () => {
    this.setState( {unreservedIsChecked: false, hasPCIsChecked: false} );
    var filter = {};
    filter.hasPC = undefined;
    filter.isReserved = undefined;
    filter.location = undefined;
    filter.search = undefined;
    this.props.updateFilter(filter)
  }

  render() {
    return (
      <div id="filterBar">
        <div>
          <h3>Filter</h3>
          <div>
            <input type="checkbox"
              name="r"
              checked={this.state.unreservedIsChecked}
              onChange={this.toggleChange} /> <label>frei</label>
          </div>
          <div>
            <input type="checkbox"
              name="pc"
              checked={this.state.hasPCIsChecked}
              onChange={this.toggleChange}
              /> <label>mit PC</label>
          </div>
          <button className="reset" onClick={this.handleResetFilter}>Zurücksetzen</button>
        </div>
      </div>
    );
  }
}
