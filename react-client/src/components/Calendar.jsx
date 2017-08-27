import React from 'react';
import DatePicker from 'material-ui/DatePicker';

class Calendar extends React.Component {

  render() {
    return (
      <div className="field clearfix date-range-start date-wrapper">
        <div className="input" onChange={this.props.handleChange} >
          <DatePicker
            hintText={this.props.description + 'Date'}
            mode="landscape"
            autoOk={true}
            onChange={(e, newVal) => {
              this.props.handleChange(newVal.toISOString().slice(0, 10))
            }}
          />
        </div>
      </div>
    )
  }
}

export default Calendar;
