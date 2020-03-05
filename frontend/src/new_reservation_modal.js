import React from 'react';
import moment from 'moment';
import axios from 'axios';

import './style.css';

const URL = "http://localhost:5000/workplaces"

export default class NewReservationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { note: "" }
    this.handleChange = this.handleChange.bind(this);
    this.postNewReservation = this.postNewReservation.bind(this);
  }

  // updated note text
  handleChange(e) {
    console.log(e.target.value)
    this.setState( {note: e.target.value} );
  }

  // sends POST request to backend to add a new reservation
  postNewReservation = (e) => {
    console.log("new post")
    var u = URL + "/" + this.props.workplace + "/reservations"
    console.log(u)
    axios.post(u, {
      startDate: moment.utc(this.props.startDate).format(),
      endDate: moment.utc(this.props.endDate).format(),
      // employee still hardcoded, implementation of employee database required
      employee: "5cfa6d37b170730a1ad5fc97",
      note: this.state.note
    })
    .then(res => {
      console.log(res);
      this.props.onClose()
      alert("Belegung erfolgreich hinzugefügt!")
    })
    .catch(err => {
      console.log(err);
      alert("ERROR: " + err)
    })
  }

  render() {
    // don't display modal if showModal is false
    if(!this.props.showModal) return null;

    return (
      <div className="modal-bg">
        <div className="modal-content">
          <form>
            <h3>Belegung für {this.props.workplace} hinzufügen</h3>
            <input type="text" name="startdate" readOnly value={moment(this.props.startDate).format("YYYY/MM/DD")} />
            bis
            <input type="text" name="enddate" readOnly value={moment(this.props.endDate).format("YYYY/MM/DD")} />
            <textarea name="note" placeholder="Notiz hinzufügen..." value={this.state.note} onChange={this.handleChange}/>
            <button type="button" onClick={this.postNewReservation}>Belegen</button>
            <button onClick={this.props.onClose}>Abbrechen</button>
          </form>
        </div>
      </div>
    );
  }
}
