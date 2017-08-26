import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, browserHistory, IndexRoute } from 'react-router';
import $ from 'jquery';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Attraction from './components/Attraction.jsx';
import config from '../../config.js';
import Flights from './components/Flights.jsx';
const FlightAPI = require('qpx-express');
import FoodList from './components/FoodList.jsx';
import Hotels from './components/Hotels.jsx'
import Map from './components/Map.jsx';
import Weather from './components/Weather.jsx';
import SavedTrips from './components/savedTrips.jsx';
import SearchBar from './components/SearchBar.jsx';
import TabMenu from './components/TabMenu.jsx';
import TabsForTripSumAndSave from './components/TabsForTripSumAndSave.jsx';
// import Login from './components/Login.jsx';
import axios from 'axios';

const boxGenFile = require('./boxGenerator.js');
// const makeBoxWiBoder = boxGenFile.makeBoxWiBoder;
const makeBoxWiNoBoder = boxGenFile.makeBoxWiNoBoder;

class App extends React.Component {
  constructor(props) {
    super(props);
    const google = window.google;
    this.state = {
      departureLocation: '',
      arrivalLocation: '',
      coords: {},
      departureDate: '',
      arrivalDate: '',
      returnDate: '',
      addresses: [
        { category: 'hotel', name: 'London Hilton on Park Lane', address: '22 Park Ln, Mayfair, London W1K 1BE, UK' },
        { category: 'restaurant', name: 'Dinner by Heston Blumenthal', address: '66 Knightsbridge, London SW1X 7LA, UK' },
        { category: 'restaurant', name: 'Nobu London', address: 'Metropolitan by COMO, 19 Old Park Ln, Mayfair, London W1K 1LB, UK' }
      ],
      flights: [],
      savedChoices: [{
        flights: {},
        hotel: {},
        attractions: [],
        food: [],
        weather: {}
      }],
      airportCodes: {},
      savedTrips: [],
      attrItems: [],
      hotels: [],
      foodList: [],
      weather: [],
      weatherIcon: ''
    }
    this.onSearch = this.onSearch.bind(this);
    this.findLocation = this.findLocation.bind(this);
    this.responseToSaveAddress = this.responseToSaveAddress.bind(this);
    this.requestWeather = this.requestWeather.bind(this);
    this.removeSingleDatabaseRecord = this.removeSingleDatabaseRecord.bind(this);
    this.saveToDatabase = this.saveToDatabase.bind(this);
    this.retrieveFromDatabase = this.retrieveFromDatabase.bind(this);
  }

  componentDidMount() {
    this.retrieveFromDatabase();
  }

  hotelsSearch() {
    $.ajax({
      url: '/hotels',
      method: 'GET',
      data: { city: this.state.arrivalLocation },
      success: (res) => {
        const parsedHotel = JSON.parse(res);
        const addHotelAddress = this.state.addresses
          .concat(parsedHotel.map(this.responseToSaveAddress('hotel')));

        this.setState({
          hotels: parsedHotel,
          addresses: addHotelAddress
        });
      },
      error: (err) => {
        console.log('error !')
      }
    });
  }

  handleHotelClick(hotel, event) {
    this.removeClass('tileDesignChosen');

    if (this.state.selectedHotelId === hotel.id) {
      this.state.savedChoices[0].hotel = {};
      delete this.state.selectedHotelId;
    } else {
      this.setState({
        selectedHotelId: hotel.id
      });
      $(event.target).toggleClass('tileDesignChosen');
      var saved = {
        name: hotel.name,
        address: hotel.location.display_address.join(', '),
        price: hotel.price,
        image_url: hotel.image_url
      };
      this.state.savedChoices[0].hotel = saved;
    }
  }

  retrieveFlights(departureDate, returnDate, depLocation, arrLocation) {
    var apiKey = process.env.QPX_API || config.flights;
    var qpx = new FlightAPI(apiKey);

    var body = {
      "request": {
        "passengers": { "adultCount": 1 },
        "slice": [{
          "origin": depLocation,
          "destination": arrLocation,
          "date": departureDate,
          "maxStops": 0
        },
        {
          "origin": arrLocation,
          "destination": depLocation,
          "date": returnDate, // YYYY-MM-DD
          "maxStops": 0
        }
        ],
        "solutions": 12,
      }
    };
    var context = this;

    qpx.getInfo(body, function(error, data) {
      context.setState({
        flights: data.trips.tripOption
      })
    });
  }

  getAirportCodes(departLoc, arrivalLoc) {
    var context = this;
    var codes = {};
    var APCAuth = process.env.APC_AUTH || config.APCAuth;
    var APCSecret = process.env.APC_SECRET || config.APCSecret;
    fetch(`https://www.air-port-codes.com/api/v1/multi?term=${departLoc}`, {
      headers: {
        Accept: "application/json",
        "APC-Auth": APCAuth,
        "APC-Auth-Secret": APCSecret
      },
      method: "POST"
    })
      .then((resp) => resp.json())
      .then(function(data) {
        if (data.airports[0].name.includes('All Airports')) {
          codes.departLoc = data.airports[1].iata;
        } else {
          codes.departLoc = data.airports[0].iata;
        }
      })
      .then(() => {
        fetch(`https://www.air-port-codes.com/api/v1/multi?term=${arrivalLoc}`, {
          headers: {
            Accept: "application/json",
            "APC-Auth": APCAuth,
            "APC-Auth-Secret": APCSecret
          },
          method: "POST"
        })
          .then((resp) => resp.json())
          .then(function(data) {
            if (data.airports[0].name.includes('All Airports')) {
              codes.arrivalLoc = data.airports[1].iata;
            } else {
              codes.arrivalLoc = data.airports[0].iata;
            }
          })
          .then((codes) => {
            context.setState({
              airportCodes: codes
            })
          })
          .then(() => {
            fetch(`https://www.air-port-codes.com/api/v1/multi?term=${arrivalLoc}`, {
              headers: {
                Accept: "application/json",
                "APC-Auth": APCAuth,
                "APC-Auth-Secret": APCSecret
              },
              method: "POST"
            })
              .then((resp) => resp.json())
              .then(function(data) {
                if (data.airports[0].name.includes('All Airports')) {
                  codes.arrivalLoc = data.airports[1].iata;
                } else {
                  codes.arrivalLoc = data.airports[0].iata;
                }
              })
              .then((codes) => {
                context.setState({
                  airportCodes: codes
                });
              })
              .then(() => {
                context.retrieveFlights(context.state.departureDate, context.state.returnDate, codes.departLoc, codes.arrivalLoc);
              });
          })
      });
  }

  removeClass(classname) {
    var elems = document.querySelectorAll(`.${classname}`);
    elems.forEach(ele => {
      ele.classList.remove(classname);
    });
  }

  handleFlightClick(flight, event) {
    this.removeClass('flightHighlight');
    if (this.state.selectedFlightId === flight.id) {
      this.state.savedChoices[0].flights = {};
      delete this.state.selectedFlightId;
    } else {
      this.setState({
        selectedFlightId: flight.id
      });
      $(event.target).toggleClass('flightHighlight');
      var flight1 = flight.slice[0];
      var flight2 = flight.slice[1];
      var saved = {
        saletotal: '$' + flight.saleTotal.slice(3),
        goingDuration: flight1.duration,
        goingOrigin: flight1.segment[0].leg[0].origin,
        goingDestination: flight1.segment[0].leg[0].destination,
        goingArrivalTime: flight1.segment[0].leg[0].arrivalTime,
        goingCarrier: flight1.segment[0].flight.carrier,
        returnDuration: flight2.duration,
        returnOrigin: flight2.segment[0].leg[0].origin,
        returnDestination: flight2.segment[0].leg[0].destination,
        returnArrivalTime: flight2.segment[0].leg[0].arrivalTime,
        returnCarrier: flight2.segment[0].flight.carrier
      };
      this.state.savedChoices[0].flights = saved;
    }
  }

  onSearch(departureLocation, arrivalLocation, departureDate, returnDate) {
    console.log('the departure location is: ', departureLocation);
    console.log('the arrival location is: ', arrivalLocation);
    console.log('the departure date is: ', departureDate);
    console.log('the return date is: ', returnDate);
    this.removeClass('flightHighlight');
    this.removeClass('hotelHighlight');
    this.setState({
      departureLocation: departureLocation,
      arrivalLocation: arrivalLocation,
      departureDate: departureDate,
      returnDate: returnDate,
      attrItems: [],
      foodList: [],
      addresses: [],
      savedChoices: [{
        flights: {},
        hotel: {},
        attractions: [],
        food: [],
        weather: {}
      }]
    }, function() {
      this.yelpAttrSearch();
      this.searchFood();
      this.getAirportCodes(departureLocation, arrivalLocation);
      this.hotelsSearch(arrivalLocation);
      this.requestWeather(arrivalLocation, departureDate);
      this.findLocation();
    });
  }

  findLocation() {
    $.ajax({
      url: '/city',
      type: 'POST',
      data: { city: this.state.arrivalLocation },
      success: (res) => {
        // console.log('Ajax Success!', res);
        this.setState({
          coords: {
            lat: res.lat,
            lng: res.lng
          }
        });
        // console.log(this.state.coords, 'State Location');
      },
      error: function(err) {
        console.log('Map Rendering Error - AJAX Failed', err);
      }
    });
  }

  yelpAttrSearch() {
    $.ajax({
      url: '/attraction',
      type: 'POST',
      data: { location: this.state.arrivalLocation },
      success: (res) => {
        const parsedAttr = JSON.parse(res);
        const addAttrAddress = this.state.addresses
          .concat(parsedAttr.map(this.responseToSaveAddress('attraction')));
        this.setState({
          attrItems: parsedAttr,
          addresses: addAttrAddress
        });
      },
      error: function(data) {
      }
    })
  }

  searchFood() {
    $.ajax({
      url: '/food',
      data: { location: this.state.arrivalLocation },
      type: 'POST',
      success: (res) => {
        const parsedFood = JSON.parse(res);
        const addFoodAddress = this.state.addresses
          .concat(parsedFood.map(this.responseToSaveAddress('food')));
        // console.log('post food req: ', parsedFood);
        this.setState({
          foodList: parsedFood,
          addresses: addFoodAddress
        });
      },

      error: (err) => {
        console.log('err', err);
      }
    })
  }

  saveToDatabase() {
    var app = this;
    $.ajax({
      url: '/save',
      method: 'post',
      data: { data: JSON.stringify(app.state.savedChoices[0]) },
      success: (data) => {
        this.retrieveFromDatabase();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  responseToSaveAddress(category) {
    return function({ name, location, coordinates }) {
      const display_address = location.display_address;
      return {
        category,
        name,
        address: display_address.join(', '),
        coordinates
      };
    }
  }


  requestWeather(city, date) {
    var context = this;
    $.ajax({
      method: "POST",
      url: "/weather",
      data: { location: city, date: date },
      success: function(data) {
        var parsedData = JSON.parse(data);
        context.setState({
          weather: [parsedData],
          weatherIcon: parsedData.icon
        })
      },
      error: function(err) {
        console.log('error in requesting data.')
      }
    })
  }

  handleAttrItemState(e) {
    this.updateSavedChoices('attractions', e.props.attrItemEntry, e.state.selected);
  }

  handleFoodItemState(e, fooditem, selected) {
    this.updateSavedChoices('food', fooditem, selected);
  }

  updateSavedChoices(categoryName, itemData, selected) {
    console.log('slected: ', selected);
    console.log('itemData:', itemData)
    let list = this.state.savedChoices[0][categoryName];
    if (list === undefined) {
      return;
    }

    var selectItem = {};
    selectItem.name = itemData.name;
    selectItem.address = itemData.location.display_address.join(', ');
    selectItem.price = itemData.price;
    selectItem.image_url = itemData.image_url;
    selectItem.category = itemData.categories[0].title;

    if (selected) {
      list.push(selectItem);
    }
    else {
      // console.log('notSelected');
      // console.log('list:', list);
      // console.log('selectedItem:', selectItem);
      // console.log('selectedItem:', selectItem);
      let index = list.indexOf(selectItem);

      for (var i = 0; i < list.length; i++) {
        var oneItem = list[i];
        if (oneItem.name === selectItem.name) {
          index = i;
          break;
        }
      }
      // console.log('index:', index)
      if (index >= 0) {
        list.splice(index, 1);
      }
    }

    this.state.savedChoices[0][categoryName] = list;
  }

  retrieveFromDatabase() {
    var context = this;
    $.ajax({
      url: '/getAll',
      method: 'GET',
      success: (data) => {
        context.setState({
          savedTrips: data
        }, function() {
        })
      },
      error: () => {
        console.log("client - error in retrieving saved data from the database");
      }
    });
  }

  removeSingleDatabaseRecord(uniqueID) {
    var context = this;
    $.ajax({
      method: "POST",
      url: "/removeRecord",
      data: { uniqueID: uniqueID },
      success: () => {
        context.retrieveFromDatabase();
      }, error: function() {
        console.log('client received an error when attempting to remove from db');
      }
    });
  }

  render() {
    return (
      <div>
        <h1 id='title'>Wanderly</h1>
        <h2 id='quote'>"Travel to Where Your Heart Desires"</h2>
        <MuiThemeProvider>
          <span><SearchBar onSearch={this.onSearch} /></span>
        </MuiThemeProvider>

        <Weather information={this.state.weather} icon={this.state.weatherIcon} />

        <div style={makeBoxWiNoBoder('TabAndMapBox', '100%', 800)}>

          <div style={makeBoxWiNoBoder('TabMenu', '65%', '100%')}>
            <MuiThemeProvider>
              <TabMenu
                handleFlightClick={this.handleFlightClick.bind(this)}
                flights={this.state.flights}
                handleHotelClick={this.handleHotelClick.bind(this)}
                hotels={this.state.hotels}
                handleAttrItemState={this.handleAttrItemState.bind(this)}
                attrItems={this.state.attrItems}
                handleFoodItemState={this.handleFoodItemState.bind(this)}
                foodlist={this.state.foodList}
              />
            </MuiThemeProvider>

            <table className='table'>
              <thead>
                <tr>
                  <th>Flights</th>
                  <th>Lodging</th>
                  <th>Attractions</th>
                  <th>Restaurants</th>
                  <th>Saved</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Flights handleFlightClick={this.handleFlightClick.bind(this)} flights={this.state.flights} />
                  </td>
                  <td>
                    <Hotels handleHotelClick={this.handleHotelClick.bind(this)} hotels={this.state.hotels} />
                  </td>
                  <td>
                    <Attraction handleAttrItemState={this.handleAttrItemState.bind(this)} attrItems={this.state.attrItems} />
                  </td>
                  <td>
                    <FoodList handleFoodItemState={this.handleFoodItemState.bind(this)} foodlist={this.state.foodList} />
                  </td>
                  <td id="savedTrips">
                    <SavedTrips
                      trips={this.state.savedTrips}
                      remove={this.removeSingleDatabaseRecord}
                      save={this.saveToDatabase}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={makeBoxWiNoBoder('TabAndMapBox', '2.5%', '100%')}></div>

          <div style={makeBoxWiNoBoder('MapContainer', '32.5%', '100%')}>
            <div style={makeBoxWiNoBoder('MAP', '100%', '50%')}><h2>
              <Map
                coords={this.state.coords}
                saved={this.state.savedChoices}
                attractions={this.state.attrItems}
                hotels={this.state.hotels}
                food={this.state.foodList}
              />
            </h2>
            </div>
            <div style={makeBoxWiNoBoder('marginBtwMapAnd', '100%', '2%')} />

            <div style={makeBoxWiNoBoder('TabMenuForTripSumAndSave', '100%', '48%')}>
              <MuiThemeProvider>
                <TabsForTripSumAndSave
                  trips={this.state.savedTrips}
                  remove={this.removeSingleDatabaseRecord}
                  save={this.saveToDatabase}
                />
              </MuiThemeProvider>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function isLoggedIn(nextState, replace, cb) {
  axios.get('/loggedin')
    .then(res => {
      if (res.data === "") {
        replace('/login');
      }
      cb();
    })
    .catch(err => {
      cb();
    });
}

function redirectToLogin() {
  window.location.href = '/login';
}

const Login = () => {
  return (
    <a href='auth/facebook'>Login With Facebook</a>
  )
}

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App} onEnter={isLoggedIn} />
    <Route path="/login" component={Login} />
    <Route path="*" onEnter={redirectToLogin} />
  </Router>
);

ReactDOM.render(
  routes
  , document.getElementById('app'));

