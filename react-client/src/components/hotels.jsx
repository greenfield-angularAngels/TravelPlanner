import React from 'react';
import HotelEntry from './HotelEntry.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GridListExampleSimple from './GridListExampleSimple.jsx';

class Hotel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotelClicked: ''
    }
  }
  render () {
    if (this.props.hotels.length > 0) {
      return (
         <div>
          <MuiThemeProvider>
            <GridListExampleSimple 
              hotels={this.props.hotels}
            />
          </MuiThemeProvider>
          { this.props.hotels.map((hotel,index) => <HotelEntry hotel={hotel} index={index} key={index} handleHotelClick={this.props.handleHotelClick.bind(this)}/>)}
        </div>
      )
    } else {
      return (
        <h3 className = "glyphicon glyphicon-home"></h3>
      )
    }

  }
}

export default Hotel;