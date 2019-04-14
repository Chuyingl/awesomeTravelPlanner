/* global google */

import React from "react";
import {Form, Select} from 'antd'
import {formItemLayout} from '../constants';
export class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
  }

  componentDidMount() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      //{ types: ["geocode"] }
    );
    //this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }

  /*handlePlaceChanged = () => {
    const place = this.autocomplete.getPlace();
    console.log(place);
    this.props.onPlaceChanged(place);
  }*/

  render() {
    return (
      <div>
        <span className="Autocomplete" >
          <input className="input" style={{width:"300px"}}
            ref={this.autocompleteInput}
            id="autocomplete"
            placeholder="Enter your start place"
            type="text"
          />
        </span>
      </div>
    );
  }
}

export default Autocomplete;

