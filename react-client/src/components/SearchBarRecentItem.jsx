import React from 'react';
import CitySearch from './CitySearch.jsx'
import Calendar from './Calendar.jsx'

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  // handleSearchClick(e) {
  //   e.preventDefault();
  //   this.props.onSearch(this.state.departureLocation, this.state.arrivalLocation, this.state.departureDate, this.state.returnDate);
  // }

  render() {
    return (
      <div className='search'>

      </div>
    )
  }
}

export default SearchBar;
