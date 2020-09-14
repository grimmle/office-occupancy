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
      axios
        .get(u)
        .then((res) => {
          setWorkplaces(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    filterChanged(filter);
  }, [props]);

  const handleReserveButtonClick = (_id) => {
    props.showModal(_id);
  };

  // main function for building the displayed list of workplaces
  const fillList = () => {
    var list = [];
    workplaces.forEach((w, i) => {
      var c = workplaces[i];
      var _id = c._id;
      var hasPC = "nein";
      if (c.hasPC) hasPC = "ja";
      var startDate = "-";
      var endDate = "-";
      var employee = "-";
      var name = "workplace-unreserved";
      var isDisabled = false;
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
          if(name === "workplace-reserved") isDisabled = true
        }
      }
      list.push(
        <tr
          key={_id}
          workplaceid={_id}
          className={name}
        >
          <td> {_id} </td>
          <td> {hasPC} </td>
          <td> {startDate} </td>
          <td> {endDate} </td>
          <td> {employee} </td>
          <td> <button type="button" className="add-button" onClick={() => handleReserveButtonClick(w._id)} disabled={isDisabled}>belegen</button> </td>
        </tr>
      );
    });
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
            <th></th>
          </tr>
          {fillList()}
        </tbody>
      </table>
      {/* <div className="button-container">
        <button
          className="plus-button"
          title="Neue Belegung"
          type="button"
          onClick={handleReserveButtonClick}
          disabled={buttonDisabled}
        ></button>
      </div> */}
    </div>
  );
}
