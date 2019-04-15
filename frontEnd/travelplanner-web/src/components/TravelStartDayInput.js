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
    prevDay = 0;
    curObj = {};

    componentDidMount() {
        console.log("TravelStartDayInput did mount");
        if (this.props.totalDays > 0) {
            this.startPoints = Array(this.props.totalDays).fill({});

            for (let i = 0; i < this.props.startPoints.length; i++) {
                const startPoint = this.props.startPoints[i];
                const {day} = startPoint;
                this.startPoints[day] = startPoint;
                if (day === 0) {
                    this.curObj = startPoint;
                }

            }
        }


    }

    componentDidMount() {
        console.log("TravelStartDayInput did mount");

    }

    componentDidUpdate() {
        console.log("TravelStartDayInput did update");
        if (this.props.totalDays > 0 && this.startPoints.length == 0) {
            this.startPoints = Array(this.props.totalDays).fill({});

            for (let i = 0; i < this.props.startPoints.length; i++) {
                const startPoint = this.props.startPoints[i];
                const {day} = startPoint;
                this.startPoints[day] = startPoint;
                if (day === 0) {
                    this.curObj = startPoint;
                }
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
            day: this.prevDay,
            intradayIndex: 0
        }
        // console.log(obj);
        // update prev to startPoints
        this.startPoints[this.prevDay] = obj;
        this.curObj = obj;

        // mark start point on map
        this.props.onPlaceChanged(obj);
    }

    handleDropdownClick = (day) => {
        this.curObj = this.startPoints[day];

        for (let i = this.prevDay + 1; i < this.props.totalDays; i++) {
            if (Object.keys(this.startPoints[i]).length === 0) {
                this.startPoints[i] = this.startPoints[i - 1];
            } else {
                break;
            }
        }
        // clear autocomplete input
        this.auto.autocompleteInput.current.value = "";

        this.prevDay = day;

    }

    handleGenerateButtonPressed = () => {
        //TODO: validation firstday

        if(this.startPoint == undefined || this.startPoint[0] == undefined || Object.keys(this.startPoints[0]).length === 0){
            //console.log(this.startPoints);
            //console.log(this.day);
            openNotificationWithIcon('warning')
        }

        this.props.onGenerateButtonPressed();

        for (let i = this.prevDay + 1; i < this.props.totalDays; i++) {
            if (Object.keys(this.startPoints[i]).length === 0) {
                this.startPoints[i] = this.startPoints[i - 1];
            } else {
                break;
            }
        }

        const endPoint = 'GeneratePaths';
        //console.log(JSON.stringify({"userID": this.props.userID, "startPlaces": this.startPoints}));
      
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


        //TODO: validation all days

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
                <Button className="button-font generate" style={{position:"absolute", marginTop:"50px"}} onClick={this.handleGenerateButtonPressed}>Travel Routes</Button>
               
            </div>

        </div>
    );
  };
}



