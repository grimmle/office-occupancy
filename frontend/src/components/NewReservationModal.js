import React, {useState} from 'react';
import moment from 'moment';
import axios from 'axios';

import '../style.css';

const URL =
  process.env.NODE_ENV === "production"
    ? "https://office-occupancy.herokuapp.com/workplaces"
    : "http://localhost:5000/workplaces";

export default function NewReservationModal(props) {
  const [note, setNote] = useState("")

  // updated note text
  const handleChange = (e) => {
    setNote(e.target.value)
  }

  // sends POST request to backend to add a new reservation
  const postNewReservation = (e) => {
    var u = URL + "/" + props.workplace + "/reservations"
    axios
      .post(u, {
        startDate: moment.utc(props.startDate).format(),
        endDate: moment.utc(props.endDate).format(),
        // employee still hardcoded, implementation of employee database required
        employee: "5e67ebc91c9d4400008b11cf",
        note: note,
      })
      .then((res) => {
        props.onClose();
        alert("Belegung erfolgreich hinzugefügt!");
      })
      .catch((err) => {
        console.log(err);
        alert("ERROR: " + err);
      });
  }

  // don't display modal if showModal is false
  if(!props.showModal) return null;

  return (
    <div className="modal-bg">
      <div className="modal">
        <form>
          <h3>Belegung für {props.workplace} hinzufügen</h3>
          <input type="text" name="startdate" readOnly value={moment(props.startDate).format("YYYY/MM/DD")} />
          bis
          <input type="text" name="enddate" readOnly value={moment(props.endDate).format("YYYY/MM/DD")} />
          <textarea name="note" placeholder="Notiz hinzufügen..." value={note} onChange={handleChange}/>
          <button type="button" onClick={postNewReservation}>Belegen</button>
          <button onClick={props.onClose}>Abbrechen</button>
        </form>
      </div>
    </div>
  );
}
