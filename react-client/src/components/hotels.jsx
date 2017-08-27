import React from 'react';
// import HotelEntry from './hotelEntry.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid_HotelList from './Grid_HotelList.jsx';
import Grid_Dollar_Sign from './Grid_Dollar_Sign.jsx';

const boxGenFile = require('../boxGenerator.js');
const makeBoxWiBoder = boxGenFile.makeBoxWiBoder;
const makeBoxWiNoBoder = boxGenFile.makeBoxWiNoBoder;

const style = {
  'textAlign': 'center',
  'fontSize': '30px',
}

class Hotels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotelClicked: ''
    }
  }

  render() {
    if (this.props.hotels.length > 0) {
      return (
        <div>

          <Grid_Dollar_Sign />

          <MuiThemeProvider>
            <Grid_HotelList
              hotels={this.props.hotels}
              handleHotelClick={this.props.handleHotelClick.bind(this)}
            />
          </MuiThemeProvider>
          {/* {this.props.hotels.map((hotel, index) => <HotelEntry hotel={hotel} index={index} key={index} handleHotelClick={this.props.handleHotelClick.bind(this)} />)} */}

        </div>
      )
    } else {
      return (
        <h3 className="glyphicon glyphicon-home"></h3>
      )
    }
  }
}

export default Hotels;
