import React, { useEffect, useState } from 'react';

import '../style.css';

export default function FilterBar(props){
  const [unreservedIsChecked, setUnreservedIsChecked] = useState(false);
  const [hasPCIsChecked, setHasPCIsChecked] = useState(false);

  useEffect(() => {
    props.updateFilter(checkToggles());
  }, [unreservedIsChecked, hasPCIsChecked])

  // toggles state of the clicked checkbox (matched by checkbox name)
  const toggleChange = (e) => {
    if(e.target.name === "r") setUnreservedIsChecked(!unreservedIsChecked)
    if(e.target.name === "pc") setHasPCIsChecked(!hasPCIsChecked)
  }

  // prepares a object with updated filters to send to App.js
  const checkToggles = () => {
    var filter = {};
    if(hasPCIsChecked === true) filter.hasPC = true; else filter.hasPC = undefined
    if(unreservedIsChecked === true) filter.isReserved = false; else filter.isReserved = undefined
    if(hasPCIsChecked === true && unreservedIsChecked === true) {
      filter.isReserved = false;
      filter.hasPC = true
    }
    return filter;
  }

  // resets all filters
  const handleResetFilter = () => {
    setHasPCIsChecked(false);
    setUnreservedIsChecked(false);
    var filter = {};
    filter.hasPC = undefined;
    filter.isReserved = undefined;
    filter.location = undefined;
    filter.search = undefined;
    props.updateFilter(filter)
  }

  return (
    <div id="filterBar">
      <h3>Filter</h3>
      <div>
        <input
          type="checkbox"
          name="r"
          checked={unreservedIsChecked}
          onChange={toggleChange}
        />{" "}
        <label>frei</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="pc"
          checked={hasPCIsChecked}
          onChange={toggleChange}
        />{" "}
        <label>mit PC</label>
      </div>
      <button className="reset" onClick={handleResetFilter}>
        zurücksetzen
      </button>
    </div>
  );
}
