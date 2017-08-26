import React from 'react';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: {
        lat: this.props.coords.lat,
        lng: this.props.coords.lng
      },
      saved: this.props.saved,
      attractions: this.props.attractions,
      hotels: this.props.hotels,
      food: this.props.food,
    }
    this.renderMap = this.renderMap.bind(this);
  }

  /**
  * Before the Initial Render, we show a default city, Paris
  */
  componentWillMount() {
    if (!this.state.coords.lat) {
      // console.log('Invoked');
      this.setState({
        // Paris
        coords: {
          lat: 48.858608,
          lng: 2.294471
        },
      });
    }
    // console.log('Normal');
    return;
  }

  componentDidMount() {
    this.renderMap();
  }

  renderMap() {
    // console.log(this.state.coords, 'renderMap Location');
    if (this.state.coords.lat) {
      this.map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.HYBRID,
        zoom: 11,
        center: {
          lat: this.state.coords.lat,
          lng: this.state.coords.lng
        }
      });

      var markers = [this.state.attractions, this.state.hotels, this.state.food];

      if (markers[0].length === 0) {
        // console.log('No Markers to Render Yet');
        return;
      }

      let that = this;
      var markerCreate = function(type, iconColor) {

        var infowindow = new google.maps.InfoWindow();
        var marker, i;

        for (i = 0; i < type.length; i++) {
          // console.log(type[i].coordinates.latitude, 'LAT');
          // If there then render marker
          if (type[i].coordinates.latitude) {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(type[i].coordinates.latitude, type[i].coordinates.longitude),
              map: that.map,
              icon: iconColor
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
              return function() {
                infowindow.setContent(type[i].name);
                infowindow.open(that.map, marker);
              }
            })(marker, i));
          } else {
            console.log('Invalid Latitude');
          }
        }
      };

      markerCreate(markers[0], 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
      markerCreate(markers[1], 'http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      markerCreate(markers[2], 'http://maps.google.com/mapfiles/ms/icons/red-dot.png');

    } else {
      // console.log('Map Not Rendered');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      // console.log('New Props!', nextProps);
      this.setState({
        coords: {
          lat: nextProps.coords.lat,
          lng: nextProps.coords.lng
        },
        saved: nextProps.saved,
        attractions: nextProps.attractions,
        hotels: nextProps.hotels,
        food: nextProps.food
      });
      // console.log('State Changed', this.state)
    } else {
      // console.log('No Change in Props');
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      // console.log('Will Update', nextProps, nextState);
    }
    this.renderMap();
  }

  render() {
    const mapStyle = {
      width: 475,
      height: 375,
      flex: 1,
      border: '1px solid black',
      alignItems: 'center',
      textAlign: 'center',
    };
    return (
      <div>
        <div ref="map" id="map" style={mapStyle}>
          <text>Loading Map...</text>
        </div>
      </div>
    );
  }
}
