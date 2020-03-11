import React from 'react';
import axios from 'axios';
import moment from 'moment';

import './style.css';

//const URL = "https://office-occupancy.herokuapp.com/workplaces"
const URL = "http://localhost:5000/workplaces"

export default class WorkplaceListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workplaces: [],
      buttonDisabled: true
    };
  }

  // main function for building the displayed list of workplaces
  fillList() {
    var list = [];
    for(var i = 0; i < this.state.workplaces.length; i++) {
      var c = this.state.workplaces[i];
      var _id = c._id;
      var hasPC = "nein";
      if(c.hasPC) hasPC = "ja";
      var startDate = "-";
      var endDate = "-";
      var employee = "-";
      var name = "workplace-unreserved";
      for(var j = 0; j < c.reservations.length; j++) {
        // already found a reservation in that range
        if(startDate !== "-" && endDate !== "-") { }
        // look for a reservation with overlapping dates, information of the first one found will be displayed
        else if(moment.utc(c.reservations[j].startDate) <= moment.utc(this.props.endDate) && moment.utc(c.reservations[j].endDate) >= moment.utc(this.props.startDate) ||
        (moment.utc(c.reservations[j].startDate) >= moment.utc(this.props.startDate) && moment.utc(c.reservations[j].startDate) <= moment.utc(this.props.endDate)) ||
        (moment.utc(c.reservations[j].endDate) >= moment.utc(this.props.startDate) && moment.utc(c.reservations[j].endDate) <= moment.utc(this.props.endDate)) ||
        (moment.utc(c.reservations[j].startDate) >= moment.utc(this.props.startDate) && moment.utc(c.reservations[j].endDate) <= moment.utc(this.props.endDate)) ||
        (new Date(c.reservations[j].startDate).getDate() === new Date(this.props.startDate).getDate() && new Date(c.reservations[j].endDate).getDate() === new Date(this.props.endDate).getDate())) {
          // css-class to display the workplace as red
          name = "workplace-reserved";
          var start = new Date(c.reservations[j].startDate);
          var d = start.getDate();
          var m = start.getMonth()+1;
          var y = start.getFullYear();
          startDate = d+"."+m+"."+y;

          var end = new Date(c.reservations[j].endDate);
          var dd = end.getDate();
          var mm = end.getMonth()+1;
          var yy = end.getFullYear();
          endDate = dd+"."+mm+"."+yy;

          employee = c.reservations[j].employee.lastName + ", " + c.reservations[j].employee.firstName;
        }
      }
      list.push(
        <tr key={ _id } workplaceid={ _id } className={ name } onClick={ this.toggleSelectedRow }>
          <td> {_id} </td>
          <td> {hasPC} </td>
          <td> {startDate} </td>
          <td> {endDate} </td>
          <td> {employee} </td>
        </tr>
      );
    }
    return list;
  }

  // on initial loading, a simple GET request is done to save all workplaces in state.workplaces
  componentDidMount() {
    axios.get(URL)
    .then(res => {
      this.setState({ workplaces: res.data });
    })
    .catch(err => {
      console.log(err);
    })
  }

  // called whenever a prop is updated
  componentDidUpdate(prevProps) {
    if((this.props.startDate !== prevProps.startDate) ||
    (this.props.endDate !== prevProps.endDate) ||
    (this.props.isReserved !== prevProps.isReserved) ||
    (this.props.hasPC !== prevProps.hasPC) ||
    (this.props.location !== prevProps.location) ||
    (this.props.search !== prevProps.search)) {
      var filter = Object.assign({}, this.props)
      delete filter.showModal
      this.filterChanged(filter)
    }
  }

  // called whenever one of the filter props changes
  filterChanged(filter) {
    var u = URL + ""
    var string;
    var j = 0;
    for(var i = 0; i < Object.keys(filter).length; i++) {
      if(Object.values(filter)[i] !== undefined && Object.values(filter)[i] !== null && Object.values(filter)[i] !== "") {
        if(j === 0) string = Object.keys(filter)[i] + "=" + Object.values(filter)[i]
        else string = string + "&" + Object.keys(filter)[i] + "=" + Object.values(filter)[i]
        j++
      }
    }
    if(string) u = URL + "?" + string;
    console.log(filter)
    console.log(u);
    axios.get(u)
    .then(res => {
      this.resetSelectedRow();
      this.setState({ workplaces: res.data });
    })
    .catch(err => {
      console.log(err);
    })
  }

  // remove id from selected table row (if there is one) and disables the '+'-button
  resetSelectedRow = () => {
    var tr = document.getElementById("workplace-selected")
    if(tr !== null) tr.id = ""
    this.setState( {buttonDisabled: true} )
  }


  toggleSelectedRow = (e) => {
    // if clicked row is already selected, deselect it
    if(e.target.parentNode.id === "workplace-selected") e.target.parentNode.id = ""
    // else deselect whatever row was selected and select the clicked one
    else {
      var tr = document.getElementById("workplace-selected")
      if(tr !== null) tr.id = ""
      // can only select a row if the workplace is not reserved
      if(e.target.parentNode.className !== "workplace-reserved") e.target.parentNode.id = "workplace-selected"
    }
    if(document.getElementById("workplace-selected") !== null) this.setState({buttonDisabled: false})
    else this.setState({buttonDisabled: true})
  }

  // open new_reservation_modal whenever '+'-button is clicked (change showModal prop to 'true')
  handleReserveButtonClick = () => {
    var workplace = document.getElementById("workplace-selected").getAttribute("workplaceid")
    console.log(moment.utc(this.props.startDate).format())
    console.log(moment.utc(this.props.endDate).format())
    this.props.showModal(workplace)
  }

  render() {
    return (
      <div className="workplace-list">
        <table>
          <tbody>
            <tr>
              <th>Arbeitsplatz</th>
              <th>PC</th>
              <th>Startdatum</th>
              <th>Enddatum</th>
              <th>Mitarbeiter</th>
            </tr>
            {this.fillList()}
          </tbody>
        </table>
        <div className="button-container">
          <button className="plus-button" title="Neue Belegung" type="button" onClick={ this.handleReserveButtonClick } disabled={ this.state.buttonDisabled }></button>
        </div>
      </div>
    );
  }
}
