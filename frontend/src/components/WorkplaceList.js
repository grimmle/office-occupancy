import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import '../style.css';

const URL =
  process.env.NODE_ENV === "production"
    ? "https://office-occupancy.herokuapp.com/workplaces"
    : "http://localhost:5000/workplaces";

export default function WorkplaceListComponent(props) {
  const [workplaces, setWorkplaces] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // on initial loading, a simple GET request is done to save all workplaces
  useEffect(() => {
    axios
      .get(URL)
      .then((res) => {
        setWorkplaces(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // called whenever a prop is updated
  useEffect(() => {
    var filter = Object.assign({}, props);
    delete filter.showModal;

    // called whenever one of the filter props changes
    const filterChanged = (filter) => {
      var u = URL + "";
      var string;
      var j = 0;
      for (var i = 0; i < Object.keys(filter).length; i++) {
        if (
          Object.values(filter)[i] !== undefined &&
          Object.values(filter)[i] !== null &&
          Object.values(filter)[i] !== ""
        ) {
          if (j === 0)
            string = Object.keys(filter)[i] + "=" + Object.values(filter)[i];
          else
            string =
              string +
              "&" +
              Object.keys(filter)[i] +
              "=" +
              Object.values(filter)[i];
          j++;
        }
      }
      if (string) u = URL + "?" + string;
      console.log(filter);
      console.log(u);
      axios
        .get(u)
        .then((res) => {
          resetSelectedRow();
          setWorkplaces(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    filterChanged(filter);
  }, [props]);

  

  // remove id from selected table row (if there is one) and disables the '+'-button
  const resetSelectedRow = () => {
    var tr = document.querySelector("#workplace-selected");
    if (tr !== null) tr.id = "";
    setButtonDisabled(true);
  };

  const toggleSelectedRow = (e) => {
    // if clicked row is already selected, deselect it
    if (e.target.parentNode.id === "workplace-selected")
      e.target.parentNode.id = "";
    // else deselect whatever row was selected and select the clicked one
    else {
      var tr = document.getElementById("workplace-selected");
      if (tr !== null) tr.id = "";
      // can only select a row if the workplace is not reserved
      if (e.target.parentNode.className !== "workplace-reserved")
        e.target.parentNode.id = "workplace-selected";
    }
    if (document.getElementById("workplace-selected") !== null)
      setButtonDisabled(false);
    else setButtonDisabled(true);
  };

  // open new_reservation_modal whenever '+'-button is clicked (change showModal prop to 'true')
  const handleReserveButtonClick = () => {
    var workplace = document
      .getElementById("workplace-selected")
      .getAttribute("workplaceid");
    console.log(moment.utc(props.startDate).format());
    console.log(moment.utc(props.endDate).format());
    props.showModal(workplace);
  };

  // main function for building the displayed list of workplaces
  const fillList = () => {
    var list = [];
    for (var i = 0; i < workplaces.length; i++) {
      var c = workplaces[i];
      var _id = c._id;
      var hasPC = "nein";
      if (c.hasPC) hasPC = "ja";
      var startDate = "-";
      var endDate = "-";
      var employee = "-";
      var name = "workplace-unreserved";
      for (var j = 0; j < c.reservations.length; j++) {
        // already found a reservation in that range
        if (startDate !== "-" && endDate !== "-") continue;
        // look for a reservation with overlapping dates, information of the first one found will be displayed
        else if (
          (moment.utc(c.reservations[j].startDate) <=
            moment.utc(props.endDate) &&
            moment.utc(c.reservations[j].endDate) >=
              moment.utc(props.startDate)) ||
          (moment.utc(c.reservations[j].startDate) >=
            moment.utc(props.startDate) &&
            moment.utc(c.reservations[j].startDate) <=
              moment.utc(props.endDate)) ||
          (moment.utc(c.reservations[j].endDate) >=
            moment.utc(props.startDate) &&
            moment.utc(c.reservations[j].endDate) <=
              moment.utc(props.endDate)) ||
          (moment.utc(c.reservations[j].startDate) >=
            moment.utc(props.startDate) &&
            moment.utc(c.reservations[j].endDate) <=
              moment.utc(props.endDate)) ||
          (new Date(c.reservations[j].startDate).getDate() ===
            new Date(props.startDate).getDate() &&
            new Date(c.reservations[j].endDate).getDate() ===
              new Date(props.endDate).getDate())
        ) {
          // css-class to display the workplace as red
          name = "workplace-reserved";
          var start = new Date(c.reservations[j].startDate);
          var d = start.getDate();
          var m = start.getMonth() + 1;
          var y = start.getFullYear();
          startDate = d + "." + m + "." + y;

          var end = new Date(c.reservations[j].endDate);
          var dd = end.getDate();
          var mm = end.getMonth() + 1;
          var yy = end.getFullYear();
          endDate = dd + "." + mm + "." + yy;

          employee = c.reservations[j].employee.lastName + ", " + c.reservations[j].employee.firstName;
        }
      }
      list.push(
        <tr
          key={_id}
          workplaceid={_id}
          className={name}
          onClick={toggleSelectedRow}
        >
          <td> {_id} </td>
          <td> {hasPC} </td>
          <td> {startDate} </td>
          <td> {endDate} </td>
          <td> {employee} </td>
        </tr>
      );
    }
    return list;
  };

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
          {fillList()}
        </tbody>
      </table>
      <div className="button-container">
        <button
          className="plus-button"
          title="Neue Belegung"
          type="button"
          onClick={handleReserveButtonClick}
          disabled={buttonDisabled}
        ></button>
      </div>
    </div>
  );
}
