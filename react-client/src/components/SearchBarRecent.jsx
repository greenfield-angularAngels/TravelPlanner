import React from 'react';
import CitySearch from './CitySearch.jsx'
import Calendar from './Calendar.jsx'

class SearchBarRecent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: []
    }

    this.handleSearchClick = this.handleSearchClick.bind(this);
  }


    handleSearchClick(e) {
      e.preventDefault();
      this.props.onSearch();
    }

  render() {
    return(
      <div className = 'search'>

      </div>
    )
  }
}

export default SearchBarRecent;
