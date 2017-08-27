import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import Flights from './Flights.jsx';
import Hotels from './hotels.jsx';
import Attractions from './Attraction.jsx';
import FoodList from './FoodList.jsx';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export default class TabMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'b',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (value) {
    this.setState({
      value: value,
    });
  };

  render() {
    return (
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
      >
        <Tab label="Flights" value="a">
          <div>
            <h2 style={styles.headline}></h2>
            <Flights handleFlightClick={this.props.handleFlightClick} flights={this.props.flights}/>
          </div>
        </Tab>
        <Tab label="Hotels" value="b">
          <div>
            <Hotels handleHotelClick={this.props.handleHotelClick} hotels={this.props.hotels}/>
          </div>
        </Tab>
        <Tab label="Attractions" value="C">
          <div>
            <h2 style={styles.headline}></h2>
            <Attractions handleAttrItemState={this.props.handleAttrItemState} attrItems={this.props.attrItems}/>
          </div>
        </Tab>
        <Tab label="Restaurants" value="D">
          <div>
            <FoodList handleFoodItemState={this.props.handleFoodItemState} foodlist={this.props.foodlist}/>
          </div>
        </Tab>
      </Tabs>
    );
  }
}
