const express = require('express');
const bodyParser = require('body-parser');
const items = require('../database-mongo');
const request = require('request');
const app = express();
const hotel = require('./hotel/hotel')
const yelpattr = require('./yelpattraction/yelpattraction')
const yelpfood = require('./yelpfood/yelpfood')
const weather = require('./weatherAPI/weather.js');
const geolocation = require('./geolocationAPI/geolocation.js');
const path = require('path')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');
var configAuth = require('../auth');
var User = require('../database-mongo/user');

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: 'anystringoftext',
  saveUninitialized: false,
  resave: false,
  key: 'user_sid'
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//app.use(flash()); // use connect-flash for flash messages stored in session

//app.set('view engine', 'ejs');

app.use((req, res, next) => {
  if (!req.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
  }
  next();
});

passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields: ['id', 'displayName', 'email']
},
  function (accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    User.findOneAndUpdate({ '_id': req.user.id }, { 'name': req.user.displayName, 'email': req.user.email }, { upsert: true }, () => {
      res.redirect('/');
    })
  });

app.get('/loggedin', (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send('');
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('user_sid');
  res.redirect('/');
});

app.post('/attraction', function (req, res) {
  const attrLocation = req.body.location;
  yelpattr.searchAttr(attrLocation, function (attrResult) {
    res.send(200, JSON.stringify(attrResult));
  })
});

app.get('/hotels', (req, res) => {
  hotel.hotel(req.query, (data) => {
    res.end(JSON.stringify(data))
  });
});


app.post('/food', function (req, res) {
  let location = req.body.location;
  yelpfood.searchFood(location, function (foodresult) {
    res.send(200, JSON.stringify(foodresult));
  });
});

app.post('/weather', function (req, res) {
  geolocation.requestGeolocation(req.body['location'], function (data) {
    geoCode = data.results[0].geometry.location;
    weather.requestWeather(geoCode, req.body['date'], function (data) {
      var parsedData = JSON.parse(data);
      var minTemp = parsedData.daily.data[0].temperatureMin;
      var maxTemp = parsedData.daily.data[0].temperatureMax;
      var averageTemp = ((minTemp + maxTemp) / 2).toFixed(2);

      res.status(201).send(JSON.stringify(
        {
          'averageTemp': averageTemp,
          'description': parsedData.daily.data[0].summary,
          'icon': parsedData.daily.data[0].icon
        }));
    });
  });
});

app.post('/city', function(req, res) {
  geolocation.requestGeolocation(req.body.city, function(data) {
    geoCode = data.results[0].geometry.location;
    // console.log('Server GeoCode', geoCode);
    res.status(201).send(geoCode);
  });
});

app.post('/save', (req, res) => {
  var data = JSON.parse(req.body.data);
  items.saveToDatabase(data, function(err, result) {

    if (err) {
      console.log('server received database error when saving a record');
    } else {
      res.sendStatus(200);
    }
  })
});

app.post('/removeRecord', (req, res) => {
  var id = req.body.uniqueID;
  items.deleteFromDatabase(id);
  res.sendStatus(200);
});

app.get('/getAll', (req, res) => {
  items.selectAll(function(err, result) {
    if (err) {
      console.log('server received database error when retrieving records');
    } else {
      res.status(200).send(result);
    }
  })
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../react-client/dist/index.html'));
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
