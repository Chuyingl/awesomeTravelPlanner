/*global google*/
import React from 'react';
import { API_ROOT } from "../constants"
import { Button, Radio, Icon, notification } from 'antd';
import { WrappedTravelMap } from "./TravelMap";
import { SortableComponent } from "./SortableList"
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

//.................. Notification Information..................//
const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Successful!',
    description: "You've saved the routes successfully!"
  });
};
const openNotificationWithIcon1 = (type) => {
  notification[type]({
    message: 'Click and see travel plan!',
  });
};
const openNotificationWithIcon2 = (type, day) => {
  notification[type]({
    message: `There is no plan for day ${day}!`,
  });
};
const openNotificationWithIcon3 = (type) => {
  notification[type]({
    message: `Please select length of days first`,
  });
};
//.................. Steps of user tour guide..................//
const steps = [
  {
    target: '.help',
    content: 'You are at travel plan page now! You can get recommended routes and costomize them here.',
  },
  {
    target: '#button-group',
    content: 'You can scroll and find the day, than your routes will show on the map!',
  },
  {
    target: '.info',
    content: 'The travel plan for the day are shown on here, you can drag the place and change the vist order that you want',
  },
  {
    target: '.save',
    content: 'You can save your current plan by clicking save',
  },

];
//fine a function to render route

export class TravelPlan extends React.Component {
  SelectedPoints = [];
  LegPoints = [];
  start = {};
  paths = [];
  directions = {};
  directions1 = {};
  toursteps = [];
  run = true;

  stepIndex = 0;



  state = {
    // for testing
    points: []

  }
  //.................. Render Routes Function..................//
  RenderRoute = (startpoint, temp2) => {
    const ori = startpoint[0];
    const des = temp2.length >= 0 ? temp2[temp2.length - 1] : ori;
    var midpoints = [];
    var temp3 = [];
    midpoints = temp2.length > 0 ? temp2.slice(0, -1) : []
    midpoints.map((point => {
      var mid = {}
      mid["location"] = { "lat": point.lat, "lng": point.lng };
      mid["stopover"] = true;
      temp3.push(mid);
    }
    ));
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
      //origin: new google.maps.LatLng( 40.7829,-73.9654),
      //origin:new google.maps.LatLng(41.8507300, -87.6512600),
      origin: ori,
      waypoints: temp3,
      //destination: new google.maps.LatLng(41.8525800, -87.6514100),
      destination: des,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: { ...result },
          markers: false
        })
        //console.log(result)
      } else {
        console.log(`error fetching directions ${result}`);
        openNotificationWithIcon1('info')
      }
    });
  };

  componentWillMount() {
    //When fist jump to this page, it load place and route for the first day. 
    var temp = this.props.points.filter(place => (place.day + 1).toString() === "1");
    var start = temp.filter(place => (place.type) === "start");
    var legs = temp.filter(place => (place.type) === "poi")
    if(this.props.points.length===0){
       openNotificationWithIcon3('info');
      }
    // Pop out notification, if there is no place and woute for day 1
    //if (legs.length === 0) {
      //openNotificationWithIcon2('info', 1);
    //}
    this.setState(
      {
        points: this.props.points,
        start: start,
        SelectedPoints: temp,
        legs: legs,
      }
    )

  }
  componentDidMount() {
    //console.log(this.state.SelectedPoints)
    var start = [];
    var legs = [];
    var temp = [];
    var temp2 = [];
    var temp3 = [];
    var startpoint = [];
    this.toursteps = [];
    if (legs == null) {
      openNotificationWithIcon2('info', 1);
    }
    else {
      temp = this.state.legs;
      temp.sort((a, b) => b.intradayIndex - a.intradayIndex);
      start = this.state.start
      console.log(legs)
      //temp.filter(place => (place.type) === "poi").sort((a, b) => b.intradayIndex - a.intradayIndex);
      start.map((dayplaces, i) =>
        startpoint.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
      );
      temp.map((dayplaces, i) =>
        temp2.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
      );
      if (temp2 != null && typeof temp2 != 'undefined') {
        this.RenderRoute(startpoint, temp2);
      }
    }
  }
  //.................. Drag List Item Call Back..................//
  // this is callback function for sortable lits, it update the intraday index of place and rerender the route and places 
  handeldrop = (e) => {
    //console.log(e);
    var temp = e
    var startpoint = []
    var start = [];
    temp.map((sort, i) => {
      temp[i].intradayIndex = i
    })
    var temp2 = []
    //sort by index_in the day 
    temp.sort((a, b) => a.intradayIndex - b.intradayIndex);
    start = this.state.points.filter(place => (place.type) === "start");
    //temp.filter(place => (place.type) === "poi").sort((a, b) => b.intradayIndex - a.intradayIndex);
    start.map((dayplaces, i) =>
      startpoint.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
    );
    temp.map((dayplaces, i) => temp2.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
    );
    //console.log(temp3);
    if (temp2 != null && typeof temp2 != 'undefined') {
      this.RenderRoute(startpoint, temp2);
      this.setState(
        {
          legs: temp,

        }
      )
    }
  }

  //.................. Filter Markers function..................//
  // this function is difined to filter places for the chosen day, and render routes at the same time 
  filtermarkers = (e) => {
    //console.log(this.state.SelectedPoints)
    var start = [];
    var legs = [];
    var temp = [];
    var temp2 = [];
    var startpoint = [];
    //var temp4=[];
    temp = this.state.points.filter(place => (place.day + 1).toString() === e.target.value);
    //sort by index_in the day 
    console.log(`temp is ${temp.length}`);
    temp.sort((a, b) => b.intradayIndex - a.intradayIndex);
    start = temp.filter(place => (place.type) === "start");
    legs = temp.filter(place => (place.type) === "poi")
    if (legs.length === 0) {
      console.log("there is no place");
      openNotificationWithIcon2('info', e.target.value);
      this.setState({
        directions: null,
        markers: false
      })
    }
    else {
      legs.sort((a, b) => a.intradayIndex - b.intradayIndex);
      console.log(legs)
      //temp.filter(place => (place.type) === "poi").sort((a, b) => b.intradayIndex - a.intradayIndex);
      start.map((dayplaces, i) =>
        startpoint.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
      );
      legs.map((dayplaces, i) =>
        temp2.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
      );
      //console.log(temp2);
      if (temp2 != null && typeof temp2 != 'undefined') {
        this.RenderRoute(startpoint, temp2);
        this.setState(
          {
            SelectedPoints: temp,
            paths: temp2,
            start: start,
            legs: legs
          }
        )
      }
      else {
        console.log("first load")
      }
    }
  }

  //.................. User Tour Guide Callback..................//
  // call back funciton for "help"
  handleJoyrideCallback = data => {
    this.setState({
      toursteps: steps,
      run: true
    }
    );
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    }

    console.groupCollapsed(type);
    console.log(data); //eslint-disable-line no-console
    console.groupEnd();
  };



 //...................... Save Buton Callback....................//
  saveButtonClicked = () => {
    const endPoint = 'UpdatePaths';
      if(this.state.legs!=null){
      var temp_legs= this.state.legs;
      var savedata=[];
      temp_legs.map((leg, i) =>
        savedata.push({ 'placeID': leg.placeID, 'day': leg.day,  'intradayIndex':leg.intradayIndex + 1})
      );
      }
     else{
       console.log("first load")
     }
      console.log(JSON.stringify({"userID": this.props.userID, "newSchedule": savedata}));

      this.props.homeTravelPlanCallback(savedata);
      fetch(`${API_ROOT}/${endPoint}`, {
          method: 'POST',
          body: JSON.stringify({"userID": this.props.userID, "newSchedule": savedata}),
          headers: {
              'Content-Type':'application/json'
          }
      }).then((response)=>{
        console.log(response.status)
        if(response.status===200){
          openNotificationWithIcon('success')
        }
        
      }  
      )
      .catch((e) => {
          console.log(e.message);

      });
  }
  


render() {
  return (
    <div className="top_container">
      {typeof (this.state.toursteps) !== "undefined" && this.state.toursteps !== [] && <Joyride
        styles={{
          options: {
            arrowColor: '#4F6E96',
            backgroundColor: 'white',
            primaryColor: '#4F6E96',
            textColor: 'black',
            width: 300,
            zIndex: 1000,
          }
        }}
        callback={this.handleJoyrideCallback}
        run={this.state.run}
        stepIndex={this.state.stepIndex}
        steps={this.state.toursteps}
        continuous={true} />}

      <div className="map_container" id="plan_map">
        <WrappedTravelMap
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyCPpNmXCFqrlF4gdU3gEMoGRvqCaqSpyk4&v=3.exp&libraries=geometry,drawing,places"}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          handleOnDayChange={this.filtermarkers}
          suppressMarkers={true}
          start={this.state.start}
          directions={this.state.directions}
          directions1={this.state.directions1}
        //markers={this.start_points.markers}
        />
        <div className="  contain-color " style={{ position: "absolute", zIndex:1000, top: "30px", height: "250px", left: "100%", "border-radius": "5px", display: "flex", overflow: "auto" }} >
          <Radio.Group id="button-group" onChange={this.filtermarkers} size={"large"} >
            {
              [...Array(this.props.totalDays).keys()].map(i =>
                <div style={{ margin: "4px", border: "solid", borderColor: "#555B6E" }}>
                  <Radio.Button className="contain-color font-white " style={{
                    border: "none", padding: "7px", "border-radius": "0px",
                  }} key={i} value={(i + 1).toString()}>Day{i + 1}</Radio.Button>
                </div>
              )
            }
          </Radio.Group>
        </div>
      </div>
      <div className="info contain-color font-white" id="plan-info">

        {
          (this.state.legs || typeof (this.state.legs) != "undefined") && (
            <SortableComponent className="font-white sortableComponent" items={this.state.legs} change={this.handeldrop} start={this.state.start} />
          )
      }
          <div>
          <Button className="button-font save" style={{ marginTop: "20px" }} onClick={this.saveButtonClicked}>Save</Button>

        </div>
      </div>
      <div className="help" style={{ position:"absolute", bottom:"10px", marginLeft:"66%", textAlign:"left" }}>
        <Button onClick={this.handleJoyrideCallback} style={{ "background-color": "lightGrey", }}><Icon type="question-circle" />Help</Button>
      </div>
    </div>
  );
}
}


