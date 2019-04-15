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
    console.log("Autocomplete did mount");
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      //{ types: ["geocode"] }
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }

  componentWillUnmount() {
    console.log("Autocomplete will unmount");
  }

  handlePlaceChanged = () => {
    const place = this.autocomplete.getPlace();
    this.props.onPlaceChanged(place);
  }

  render() {
    return (
      <div>

        <span className="Autocomplete">
          <input className="input" style={{width: "250px"}}
            ref={this.autocompleteInput}
            id="autocomplete"
            placeholder="Please enter the start place"
            type="text"
          />
        </span>
      </div>
    );
  }
}

export default Autocomplete;

