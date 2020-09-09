import React from 'react';
import moment from 'moment';
import { BrowserRouter as Router} from 'react-router-dom';

import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import WorkplaceListComponent from './components/WorkplaceList';
import NewReservationModal from "./components/NewReservationModal";
import CalendarView from "./components/CalendarView";

import './style.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReserved: undefined,
      hasPC: undefined,
      location: undefined,
      startDate: moment.utc(Date.now()).format("YYYY/MM/DD"),
      endDate: moment.utc(Date.now()).format("YYYY/MM/DD"),
      search: "",
      showModal: false,
      workplace: undefined
    }
  }

// called when selected filters change
  updateFilter = (updatedFilter) => {
    this.setState(updatedFilter);
  }

// called when user enters a search term
  updateSearch = (updatedSearch) => {
    this.setState({search: updatedSearch});
  }

// called when users selects a daterange
  selectedDays = (days) => {
    for(var key in days) {
      if(days.hasOwnProperty(key)) {
        if(days[key] !== null && days[key] !== undefined) {
          days[key] = moment.utc(days[key]).format("YYYY/MM/DD")
        }
      }
    }
    this.setState(days);
  }

  toggleModal = (workplace) => {
    this.setState({ showModal: !this.state.showModal, workplace: workplace});
  }

  render() {
    return(
      <Router>
        <div id="app">
          <Header
            updateSearch = {this.updateSearch}
            />
          <FilterBar
            updateFilter = {this.updateFilter}
            />
          <CalendarView
            selectedDays = {this.selectedDays}
            />
          <WorkplaceListComponent
            isReserved = {this.state.isReserved}
            hasPC = {this.state.hasPC}
            location = {this.state.location}
            startDate = {this.state.startDate}
            endDate = {this.state.endDate}
            search = {this.state.search}
            showModal = {this.toggleModal}
            />
          <NewReservationModal
            showModal = {this.state.showModal}
            onClose = {this.toggleModal}
            workplace = {this.state.workplace}
            hasPC = {this.state.hasPC}
            location = {this.state.location}
            startDate = {this.state.startDate}
            endDate = {this.state.endDate}
            />
        </div>
      </Router>
    );
  }
}
