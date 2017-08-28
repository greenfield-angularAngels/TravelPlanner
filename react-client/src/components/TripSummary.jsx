import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Money from 'material-ui/svg-icons/editor/attach-money'
import Star from 'material-ui/svg-icons/toggle/star';
import ActionGrade from 'material-ui/svg-icons/action/grade';

import SavedRecordPanel from './SavedRecordPanel.jsx';

const boxGenFile = require('../boxGenerator.js');
const makeBoxWiBoder = boxGenFile.makeBoxWiBoder;
const makeBoxWiNoBoder = boxGenFile.makeBoxWiNoBoder;

export default class TripSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    }
  }

  // returnDate={this.props.returnDate} 
  // arrivalDate={this.props.arrivalDate} 
  // departureLocation={this.props.departureLocation} 
  // arrivalLocation={this.props.arrivalLocation} 

  render() {

    if (this.props.departureDate.length === 0) {

      return (
        <div>
          <div style={makeBoxWiNoBoder('box', '100%', '10px', 'black')} ></div>
          <h3>
            depart:
          </h3>
          <h3>
            return:
          </h3>
        </div>
      );

    } else {

      return (
        <div>
          <div style={makeBoxWiNoBoder('box', '100%', '10px', 'black')} ></div>
          <h3>
            depart: {this.props.departureDate + ' ' + 'to ' + '<' + this.props.departureLocation + '>'} 
          </h3>
          <h3>
            return: {this.props.returnDate + ' ' + 'back to ' + '<' + this.props.arrivalLocation + '>'} 
          </h3>
        </div>
      );

    }

  }

}
