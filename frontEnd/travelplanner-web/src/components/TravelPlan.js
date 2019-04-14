/*global google*/
import React from 'react';
import { API_ROOT } from "../constants"
import { Button, Radio, Icon, notification } from 'antd';
import { Rectangle, withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps"
import { WrappedTravelMap } from "./TravelMap";
import Board from "./Board";
import RatioButtons from "./RatioButtons";
import  {SortableComponent} from "./SortableList"
import {arrayMove} from 'array-move'
import Background from '../assets/images/background.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {UserTour} from '../components/UserTour';
import Joyride ,{ ACTIONS, EVENTS, STATUS}  from 'react-joyride';


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
const openNotificationWithIcon2 = (type,day) => {
  notification[type]({
    message: `There is no plan for day ${day}!`,
  });
};
const testingGeneratedPoints = [

  {placeID: "ChIJgzD7uFVYwokRXCoEdvGu-av", type: "poi", lat: 40.7829, lon: -73.9654, name: "central park", imageURL: "https://thenypost.files.wordpress.com/2018/07/central-park-conservancy.jpg?quality=90&strip=all&w=618&h=410&crop=1", day:0, intradayIndex: 1},
  {placeID: "ChIJgzD7uFVYwoerwCoEdvGa-as", type: "poi", lat: 40.7794, lon: -73.9632, name: "The Metropolitan Museum of Art", imageURL: "https://cdn.getyourguide.com/img/tour_img-210854-148.jpg", day: 0, intradayIndex: 2},
  {placeID: "ChIJavd7uFVYwokRXCoEdwsu-wA", type: "poi", lat: 40.7614, lon: -73.9776, name: "MoMa", imageURL: "https://images.musement.com/cover/0001/31/moma-museum-of-modern-art-tickets-tours-jpg_header-30520.jpeg?&q=60&fit=crop&lossless=true&auto=format&w=412&h=250", day: 1, intradayIndex: 3},
  {placeID: "ChIJgzD7uFVYwokRXCoEdvGc-re", type: "poi", lat: 40.7425, lon: -74.0061, name: "Chelsea Market", imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Chelsea_Market.jpg/350px-Chelsea_Market.jpg", day:1, intradayIndex: 2},
  {placeID: "ChIJgzD7uFVYwdtwXCosdfGu-sA", type: "poi", lat: 40.7308, lon: -73.9973, name: "Washington Square Park", imageURL:"https://media.cntraveler.com/photos/55f6f83ef36883a0540d6845/4:5/w_767,c_limit/Washington-Square-Park-cr-getty.jpg", day:2, intradayIndex: 3},
  {placeID: "ChIJgzD7uFVYwokRXCoEdvds-zA", type: "poi", lat: 40.8296, lon: -73.9262, name: "Yankee Stadium", imageURL: "https://www.wheretraveler.com/sites/default/files/styles/wt17_promoted_large/public/images/YANKEE%20STADIUM_OVE%23747D12.jpg?itok=KHnOsPcI&timestamp=1451406398", day:2, intradayIndex: 1},
  {placeID: "ChIJgzD7uFVYwokavdeEdvGu-wA", type: "start", lat: 40.7829, lon: -73.9654, name: "aa", imageURL: "", day:0, intradayIndex: 0},
  {placeID: "ChIJgzcdsFVYwokRXCoEdvGu-aA", type: "start", lat: 40.7829, lon: -73.9654, name: "bb", imageURL: "", day:1, intradayIndex: 0},
  {placeID: "ChIJgzD7uFfdskRXCoEdvGud-dv", type: "start", lat: 40.7829, lon: -73.9654, name: "yy", imageURL: "", day:2, intradayIndex: 0},
];
const steps= [
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

export class TravelPlan extends React.Component {
    SelectedPoints = [];
    LegPoints=[];
    start={};
    paths=[];
    directions={};
    directions1={};
    toursteps=[];
    run=true;

    stepIndex=0;
   
    
    
    state = {
        // for testing
        points: []
        
    }

    componentWillMount(){
        //const testingGeneratedPoints=this.props.points;
        var temp=this.props.points.filter(place => (place.day+1).toString() === "1");
        //var temp=testingGeneratedPoints.filter(place => (place.day+1).toString() === "1");
        //console.log(temp)
        var start=temp.filter(place => (place.type) === "start");
        var legs=temp.filter(place => (place.type) === "poi")
        if(legs.length===0){
          openNotificationWithIcon2('info',1);
        }
        //sort by index_in the day 
        //var temp2=[]
        //temp.filter(place => (place.type) === "poi").sort((a, b) => b.intradayIndex - a.intradayIndex);
        //temp.map((dayplaces, i) =>
            //temp2.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
        //);
        //console.log(temp2);
        //if(temp2!=null&& typeof temp2!= 'undefined'){
        //const ori = temp2[0];
        //const des = temp2.length >= 2 ? temp2[temp2.length-1]:ori;
        //var midpoints= [];
        //var temp3=[];
        //midpoints= temp2.length>2?temp2.slice(1,-1): []
        //midpoints.map((point=>{
           //var mid={}
           //mid["location"] ={"lat":point.lat, "lng":point.lng};
           //mid["stopover"]=true
           //temp3.push(mid);
        //}
        //));
       //console.log(temp3);
        this.setState(
            {
                points: this.props.points,
                start: start,
                SelectedPoints: temp,
                legs:legs,
             }
        )
    
  }
  componentDidMount() {
         //console.log(this.state.SelectedPoints)
         var start=[];
         var legs=[];
         var temp = [];
         var temp2 = [];
         var temp3=[];
         var startpoint=[];
         this.toursteps=[];
         if(legs==null){
           openNotificationWithIcon2('info',1);
         }
         else{
         temp=this.state.legs;
         temp.sort((a, b) => b.intradayIndex - a.intradayIndex);
         start=this.state.start
         console.log(legs)
         //temp.filter(place => (place.type) === "poi").sort((a, b) => b.intradayIndex - a.intradayIndex);
         start.map((dayplaces, i) =>
             startpoint.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
         );
         temp.map((dayplaces, i) =>
             temp2.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
         );
         if(temp2!=null&& typeof temp2!= 'undefined'){
          const ori = startpoint[0];
          const des = temp2.length >= 0 ? temp2[temp2.length-1]:ori;
          var midpoints= [];
          var temp3=[];
          midpoints= temp2.length>0?temp2.slice(0,-1): []
          midpoints.map((point=>{
             var mid={}
             mid["location"] ={"lat":point.lat, "lng":point.lng};
             mid["stopover"]=true;
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
                  directions: {...result},
                  markers: false
                })
         //console.log(result)
       } else {
         console.log(`error fetching directions ${result}`);
         openNotificationWithIcon1('info')
         
       }
     });
  }
}
  }
  
    
    
    handeldrop= (e) => {
        //console.log(e);
        var temp=e
        var startpoint=[]
        var start=[];
        temp.map((sort,i)=>{
            temp[i].intradayIndex=i
        })
        var temp2=[]
        //sort by index_in the day 
        temp.sort((a, b) => a.intradayIndex - b.intradayIndex);
        start=this.state.points.filter(place => (place.type) === "start");
        //temp.filter(place => (place.type) === "poi").sort((a, b) => b.intradayIndex - a.intradayIndex);
        start.map((dayplaces, i) =>
            startpoint.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
        );
         temp.map((dayplaces, i) => temp2.push({ 'lat': dayplaces.lat, 'lng': dayplaces.lon })
        );
        //console.log(temp3);
        if(temp2!=null&& typeof temp2!= 'undefined'){
            const ori = startpoint[0];
            const des = temp2.length >= 0 ? temp2[temp2.length-1]:ori;
            var midpoints= [];
            var temp3=[];
            midpoints= temp2.length>0?temp2.slice(0,-1): []
            midpoints.map((point=>{
               var mid={}
               mid["location"] ={"lat":point.lat, "lng":point.lng};
               mid["stopover"]=true;
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
             directions: {...result},
             markers: false
           })
           //console.log(result)
         } else {
           console.log(`error fetching directions ${result}`);
         }
       });
        this.setState(
            {
                legs: temp,

             }
                )   
      }
    }
    
    filtermarkers = (e) => {
        //console.log(this.state.SelectedPoints)
        var start=[];
        var legs=[];
        var temp = [];
        var temp2 = [];
        var temp3=[];
        var startpoint=[];
        //var temp4=[];
        temp=this.state.points.filter(place => (place.day+1).toString() === e.target.value);
        //sort by index_in the day 
        console.log(`temp is ${temp.length}`);
        temp.sort((a, b) => b.intradayIndex - a.intradayIndex);
        start=temp.filter(place => (place.type) === "start");
        legs=temp.filter(place => (place.type) === "poi")
        if(legs.length===0){
          console.log("there is no place");
          openNotificationWithIcon2('info',e.target.value);
          this.setState({
            directions: null,
            markers: false
          })
         }
        else{
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
        if(temp2!=null&& typeof temp2!= 'undefined'){
        //connect start point with the first place
        const ori = startpoint[0];
        const des = temp2[0];
       //console.log(des);
       const DirectionsService = new google.maps.DirectionsService();
       DirectionsService.route({
          //origin: new google.maps.LatLng( 40.7829,-73.9654),
         //origin:new google.maps.LatLng(41.8507300, -87.6512600),
         origin: ori,
         //destination: new google.maps.LatLng(41.8525800, -87.6514100),
         destination: des,
         travelMode: google.maps.TravelMode.DRIVING,
       }, (result1, status) => {
         if (status === google.maps.DirectionsStatus.OK) {
           this.setState({
             directions1: {...result1},
             markers: false
           })
            //console.log(result1)
         } else {
           console.log(`error fetching directions ${result1}`);
         }
       });
       //connect other leg points
       const ori1 = startpoint[0];
       const des1 = temp2[temp2.length-1];
       var midpoints= [];
       midpoints= temp2.length>0?temp2.slice(0,-1): []
       midpoints.map((point=>{
          var mid={}
          mid["location"] ={"lat":point.lat, "lng":point.lng};
          mid["stopover"]=true;
          temp3.push(mid);
       }
       ));
      //console.log(temp3);
      const DirectionsService1 = new google.maps.DirectionsService();
      DirectionsService1.route({
        //origin: new google.maps.LatLng( 40.7829,-73.9654),
        //origin:new google.maps.LatLng(41.8507300, -87.6512600),
        origin: ori1,
         waypoints: temp3,
        //destination: new google.maps.LatLng(41.8525800, -87.6514100),
        destination: des1,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: {...result},
            markers: false
          })
           //console.log(result)
        } else {
          console.log(`error fetching directions ${result}`);
        }
      });
        this.setState(
            {
                SelectedPoints: temp,
                paths:temp2,
                start:start,
                legs:legs
            }
        )
    }
    else{
        console.log("first load")
    }
   }
  }
  handleJoyrideCallback = data => {
    this.setState( {
        toursteps: steps,
        run:true
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

  closeHelp =()=>{
    this.setState( {
      toursteps:[]
    })
    console.log(this.state.run);
    console.log(this.state.toursteps);
  };
       
    saveButtonClicked = () => {
      const endPoint = 'UpdatePaths';
        if(this.state.legs!=null){
        var temp_legs= this.state.legs;
        var savedata=[];
        temp_legs.map((leg, i) =>
          savedata.push({ 'placeID': leg.placeID, 'day': leg.day,  'intradayIndex':leg.intradayIndex + 1})
        );
        //temp_legs=this.state.start!=null? temp_legs.concat(this.state.start):temp_legs;
        //var day_index=temp_legs[0].intradayIndex;
        // filter the places of other days
        //var other_days_points= this.state.points.filter(point => point.intradayIndex !== day_index);
        //var cur_points= other_days_points.concat(temp_legs)
        //this.setState({
          // points: cur_points
        //})
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
       
        //const Background= "D:\travel\awesomeTravelPlanner\frontEnd\travelplanner-web\src\assets\images\background.jpg"
        return (
           <div className="top_container">
                 {typeof(this.state.toursteps)!=="undefined"&&this.state.toursteps!==[]&&<Joyride
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
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyCvUbj7eqr0u0RFbaNFGU9JAWYAoi5JmwY&v=3.exp&libraries=geometry,drawing,places"}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `800px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    handleOnDayChange={this.filtermarkers}
                    suppressMarkers={true}
                    start={this.state.start}
                    directions={this.state.directions}
                    directions1={this.state.directions1}
                    //markers={this.start_points.markers}
                />
                    <div className="  contain-color "  style={{ position:"absolute",top:"30px",height:"250px", left:"100%","border-radius": "5px",display:"flex", overflow:"auto"}} >
                        <Radio.Group id="button-group" onChange={this.filtermarkers} size={"large"} >
                            {
                                [...Array(this.props.totalDays).keys()].map(i =>
                                    <div style={{margin:"4px", border:"solid", borderColor:"#555B6E" }}>
                                        <Radio.Button className="contain-color font-white " style={{  border: "none", padding:"7px", "border-radius": "0px",
                                        }} key={i} value={(i+1).toString()}>Day{i+1}</Radio.Button>
                                    </div>
                                )
                            }
                        </Radio.Group>
                    </div>
                </div>
                <div className="info contain-color font-white" id="plan-info">
                    
                    {
                      (this.state.legs||typeof(this.state.legs)!="undefined")&&(
                        <SortableComponent className="font-white sortableComponent" items={this.state.legs} change={this.handeldrop} start={this.state.start} />
                      )  
                    }
                    <div>
                        <Button className="button-font save" style={{marginTop: "20px"}} onClick={this.saveButtonClicked}>Save</Button>
                    
                 </div>
                 </div>
               <div className="help" style={{ position:"absolute", bottom:"0px", marginLeft:"1350px", textAlign:"left" }}>
                   <Button onClick={this.handleJoyrideCallback} style={{"background-color": "lightGrey", }}><Icon type="question-circle"/>Help</Button>
               </div>
           </div>
        );
    }
  }

 
  