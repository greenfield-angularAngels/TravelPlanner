import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

export default class Form extends React.Component {

  constructor() {
    super();
    this.state = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  };

  }


  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <a href="/auth/facebook">Login with Facebook</a>
    )
  }
}

