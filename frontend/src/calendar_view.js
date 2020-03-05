import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import moment from 'moment';
import 'moment/locale/de';

import 'react-day-picker/lib/style.css';
import './style.css';

export default class CalendarView extends React.Component {
  // mostly the same as https://react-day-picker.js.org/examples/selected-range-enter
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      from: new Date(),
      to: new Date(),
      enteredTo: null
    };
  }
  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }
  handleDayClick(day, modifiers = {}) {
    const { from, to } = this.state;
    if(modifiers.disabled) {
      return;
    }
    if(from && to && day >= from && day <= to) {
      this.handleResetClick();
      return;
    }
    if(this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null
      });
    } else {
      this.setState({
        to: day,
        enteredTo: day,
      }, () => {
        this.props.selectedDays({startDate: this.state.from, endDate: this.state.to});
      });
    }
  }
  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if(!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day,
      });
    }
  }
  handleResetClick() {
    if(this.state.from.getDate() === new Date().getDate() && this.state.to.getDate() === new Date().getDate()) {
    } else {
      this.setState(this.getInitialState(), () => {
        this.props.selectedDays({startDate: this.state.from, endDate: this.state.to});
      });
    }
  }

  render() {
    const { from, to, enteredTo } = this.state;
    const modifiers = {
      start: from,
      end: enteredTo,
      reserved: this.props.reservedDays,
    };
    const modifierStyles = {
      reserved: {
        backgroundColor: "#ff0000",
        color: "#ff0000"
      },
    };
    const disabledDays = { before: this.state.from};
    const selectedDays = [from, { from, to: enteredTo }];
    return (
      <div className="calendar-view">
        <DayPicker
          localeUtils = { MomentLocaleUtils }
          locale = "de"
          className = "Range"
          fromMonth = { from }
          onDayClick = { this.handleDayClick }
          onDayMouseEnter = { this.handleDayMouseEnter }
          selectedDays = { selectedDays }
          disabledDays= { disabledDays, {daysOfWeek: [0, 6]} }
          modifiers = { modifiers }
          modifierStyles = { modifierStyles }
          showWeekNumbers
          todayButton = "Heute"
          numberOfMonths = { 3 }
          />
      </div>
    );
  }
}
