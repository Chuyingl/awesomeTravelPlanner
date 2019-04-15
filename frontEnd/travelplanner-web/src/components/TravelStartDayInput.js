import React from 'react';
import {Dropdown} from './Dropdown';
import {Autocomplete} from "./Autocomplete";
import { API_ROOT } from "../constants"
import {notification,Button} from  'antd'

//import 'antd/dist/antd.css';
//import './index.css';
const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Warning!',
      description: 'Please enter the start address!',
    });
  };
export class TravelStartDayInput extends React.Component {

    message= ""
    startPoints = []; // with order
    curDay = 0;

    componentDidMount() {
        console.log("TravelStartDayInput did mount");



    }

    componentDidUpdate() {
        console.log("TravelStartDayInput did update");
        if (this.props.totalDays > 0) {
            this.startPoints = Array(this.props.totalDays).fill({});

            for (let i = 0; i < this.props.startPoints.length; i++) {
                const startPoint = this.props.startPoints[i];
                const {day} = startPoint;
                this.startPoints[day] = startPoint;

            }
        }
    }


    componentWillUnmount() {
        console.log("TravelStartDayInput will unmount");
    }

    handlePlaceChanged = (place) => {
        const obj = {
            placeID: place.place_id,
            type: "start",
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng(),
            name: place.name,
            imageURL: "",
            day: this.curDay,
            intradayIndex: 0
        }
        // console.log(obj);
        // update prev to startPoints
        this.startPoints[this.curDay] = obj;

        // mark start point on map
        this.props.onPlaceChanged(obj);
    }

    handleDropdownClick = (day) => {
        this.curDay = day;

        // clear autocomplete input
        this.auto.autocompleteInput.current.value = "";
    }

    handleGenerateButtonPressed = () => {
        //validation firstday
        if(this.startPoints == undefined || this.startPoints[0] == undefined || Object.keys(this.startPoints[0]).length === 0){
            //console.log(this.startPoints);
            //console.log(this.day);
            openNotificationWithIcon('warning')
        }

        // interpolation
        for (let i = 1; i < this.props.totalDays; i++) {
            if (Object.keys(this.startPoints[i]).length === 0) {
                this.startPoints[i] = JSON.parse(JSON.stringify(this.startPoints[i - 1])); // deep copy
                this.startPoints[i].day = i;
            }
        }


        const endPoint = 'GeneratePaths';
        console.log(JSON.stringify({"userID": this.props.userID, "startPlaces": this.startPoints}));
      
        fetch(`${API_ROOT}/${endPoint}`, {
            method: 'POST',
            body: JSON.stringify({"userID": this.props.userID, "startPlaces": this.startPoints}),
            headers: {
                'Constent-Type': 'text/plain'
            }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((data) => {
            this.props.onGeneratePathsObtained(data.places);
        }).catch((e) => {
            console.log(e.message);
        })


    }


    render () {
    return (
        <div className="div" style={{ margintop:"30px",textAlign:"left",display:"block"}}>
            <div className="Dropdown" style={{position:"absolute"}}>
                <Dropdown onDropdownClick={this.handleDropdownClick}
                          totalDays={this.props.totalDays}/>
            </div>

            <div className="Address" style={{position:"absolute", marginTop:"50px"}} >
                <Autocomplete onPlaceChanged={this.handlePlaceChanged}
                              ref={(input) => { this.auto = input; }}/>


            <Button className="button-font generate" style={{position:"absolute", marginTop:"50px"}}
                        onClick={this.handleGenerateButtonPressed}>Recommend Routes</Button>
            </div>

        </div>
    );
  };
}



