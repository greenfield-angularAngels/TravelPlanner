import React from 'react';
import CitySearch from './CitySearch.jsx'
import Calendar from './Calendar.jsx'

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departureLocation: 'hong kong',
      arrivalLocation:'tokyo',
      departureDate: '2017-10-24',
      returnDate: '2017-10-31',
      // histories: [["hong kong", "tokyo", "2017-10-24", "2017-10-31"]]
    }
    this.handleDepartureText = this.handleDepartureText.bind(this);
    this.handleArrivalText = this.handleArrivalText.bind(this);
    this.handleDepartureDate = this.handleDepartureDate.bind(this);
    this.handleReturnDate = this.handleReturnDate.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);

  }

    handleDepartureText(e) {
      this.setState({
        departureLocation: e.target.value
      })
    }

    handleArrivalText(e) {
      this.setState({
        arrivalLocation: e.target.value
      })
    }

    handleDepartureDate(e) {
      this.setState({
        departureDate: e.target.value
      })
    }

    handleReturnDate(e) {
      this.setState({
        returnDate: e.target.value
      })
    }

    handleSearchClick(e) {
      e.preventDefault();
      var inputs = [this.state.departureLocation, this.state.arrivalLocation, this.state.departureDate, this.state.returnDate];
      
      var sumLength = inputs.reduce(function(sum, value) {
        return sum + value.length;
      }, 0);

      if (sumLength > 0) {
        this.props.onSearch(...inputs);
        // this.handleSearchClickHistory(e); 
      } else {
        console.log('missing all field values')
      }
    }


    // handleSearchClickHistory(e) {

    //   e.preventDefault();

    //   var inputs = [this.state.departureLocation, this.state.arrivalLocation, this.state.departureDate, this.state.returnDate];
      
    //   var newHistories = this.state.histories.slice();
    //   newHistories.unshift(inputs);

    //   this.setState({histories: newHistories});

    // }



  render() {
    return(
      <div className = 'search'>
        <form >
            <div className="search-wrapper group">
              <CitySearch handleChange = {this.handleDepartureText} description = "Departure City"/>
              <CitySearch handleChange = {this.handleArrivalText} description = "Arrival City"/>
              <Calendar handleChange = {this.handleDepartureDate} description = "Departure"/>
              <Calendar handleChange = {this.handleReturnDate} description = "Return"/>
              <button type = 'submit' onClick = {this.handleSearchClick} >Search</button>

            </div>
        </form>
      </div>
    )
  }
}

export default SearchBar;
