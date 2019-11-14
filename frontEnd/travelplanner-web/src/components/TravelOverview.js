/*global google*/
import React from 'react';
//import $ from 'jquery'
import { Menu, Dropdown, Form, Row, Col, Input, Button, Icon } from 'antd';
import { API_ROOT } from "../constants"
//import { StartAddressInputForm } from "./StartAddressInputForm";
//import { GeneratePathsButton } from "./GeneratePathsButton";

import { WrappedTravelMap } from "./TravelMap";
import { Link } from "react-router-dom";
//import {GOOGLE_GEOCODE_API, PLACE_API_K} from "../constants";
import {TravelStartDayInput} from "./TravelStartDayInput"
import Joyride,{ ACTIONS, EVENTS, STATUS}  from 'react-joyride';
const steps= [
    {
       target: '.help',
       content: 'You are at overview page now! At this page. You can tell us the duration and start points of your trip, and we will provide the most polular places in the NY to you. Based on these initial recommendation, you can also add/change/delete these places.',
    },
    {
      target: '#day-options',
      content: 'First, choose the duration of your trip',
    },
    {
      target: '.map',
      content: 'Aha...now you can see thec recommended places now! By left clicking the mark, you see of information of the place. By right clicking the mark, you can delete this place or change the day to visit.',
    },
    {
      target: '.Dropdown',
      content: ' You need specify a day then',
    },
    {
      target: '.input',
      content: 'Almost done! You need enter your start point',
    },
    {
        target: '.generate',
        content: 'Last Step, click this button and you wil get your private plan!',
    }
    
  ];
export class TravelOverview extends React.Component {

    testingPoints =  [
        {placeID: "ChIJgzD7uFVYwokRXCoEdvGu-av", type: "poi", lat: 40.7829, lon: -73.9654, name: "central park", imageURL: "https://thenypost.files.wordpress.com/2018/07/central-park-conservancy.jpg?quality=90&strip=all&w=618&h=410&crop=1", day:0, intradayIndex: -1},
        {placeID: "ChIJgzD7uFVYwoerwCoEdvGa-as", type: "poi", lat: 40.7794, lon: -73.9632, name: "The Metropolitan Museum of Art", imageURL: "https://cdn.getyourguide.com/img/tour_img-210854-148.jpg", day: 0, intradayIndex: -1},
        {placeID: "ChIJavd7uFVYwokRXCoEdwsu-wA", type: "poi", lat: 40.7614, lon: -73.9776, name: "MoMa", imageURL: "https://images.musement.com/cover/0001/31/moma-museum-of-modern-art-tickets-tours-jpg_header-30520.jpeg?&q=60&fit=crop&lossless=true&auto=format&w=412&h=250", day: 1, intradayIndex: -1},
        {placeID: "ChIJgzD7uFVYwokRXCoEdvGc-re", type: "poi", lat: 40.7425, lon: -74.0061, name: "Chelsea Market", imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Chelsea_Market.jpg/350px-Chelsea_Market.jpg", day:1, intradayIndex: -1},
        {placeID: "ChIJgzD7uFVYwdtwXCosdfGu-sA", type: "poi", lat: 40.7308, lon: -73.9973, name: "Washington Square Park", imageURL:"https://media.cntraveler.com/photos/55f6f83ef36883a0540d6845/4:5/w_767,c_limit/Washington-Square-Park-cr-getty.jpg", day:2, intradayIndex: -1},
        {placeID: "ChIJgzD7uFVYwokRXCoEdvds-zA", type: "poi", lat: 40.8296, lon: -73.9262, name: "Yankee Stadium", imageURL: "https://www.wheretraveler.com/sites/default/files/styles/wt17_promoted_large/public/images/YANKEE%20STADIUM_OVE%23747D12.jpg?itok=KHnOsPcI&timestamp=1451406398", day:2, intradayIndex: -1}
    ];

    testingStartPoints = [
        {placeID: "ChIJgzD7uFVYwokavdeEdvGu-wA", type: "start", lat: 40.7829, lon: -73.9654, name: "aa", imageURL: "", day:0, intradayIndex: 0},
        {placeID: "ChIJgzcdsFVYwokRXCoEdvGu-aA", type: "start", lat: 40.7829, lon: -73.9654, name: "bb", imageURL: "", day:1, intradayIndex: 0},
        {placeID: "ChIJgzD7uFfdskRXCoEdvGud-dv", type: "start", lat: 40.7829, lon: -73.9654, name: "cc", imageURL: "", day:2, intradayIndex: 0},
    ];

    testingGeneratedPoints = [

        {placeID: "ChIJgzD7uFVYwokRXCoEdvGu-av", type: "poi", lat: 40.7829, lon: -73.9654, name: "central park", imageURL: "https://thenypost.files.wordpress.com/2018/07/central-park-conservancy.jpg?quality=90&strip=all&w=618&h=410&crop=1", day:0, intradayIndex: 1},
        {placeID: "ChIJgzD7uFVYwoerwCoEdvGa-as", type: "poi", lat: 40.7794, lon: -73.9632, name: "The Metropolitan Museum of Art", imageURL: "https://cdn.getyourguide.com/img/tour_img-210854-148.jpg", day: 0, intradayIndex: 2},
        {placeID: "ChIJavd7uFVYwokRXCoEdwsu-wA", type: "poi", lat: 40.7614, lon: -73.9776, name: "MoMa", imageURL: "https://images.musement.com/cover/0001/31/moma-museum-of-modern-art-tickets-tours-jpg_header-30520.jpeg?&q=60&fit=crop&lossless=true&auto=format&w=412&h=250", day: 1, intradayIndex: 3},
        {placeID: "ChIJgzD7uFVYwokRXCoEdvGc-re", type: "poi", lat: 40.7425, lon: -74.0061, name: "Chelsea Market", imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Chelsea_Market.jpg/350px-Chelsea_Market.jpg", day:1, intradayIndex: 2},
        {placeID: "ChIJgzD7uFVYwdtwXCosdfGu-sA", type: "poi", lat: 40.7308, lon: -73.9973, name: "Washington Square Park", imageURL:"https://media.cntraveler.com/photos/55f6f83ef36883a0540d6845/4:5/w_767,c_limit/Washington-Square-Park-cr-getty.jpg", day:2, intradayIndex: 3},
        {placeID: "ChIJgzD7uFVYwokRXCoEdvds-zA", type: "poi", lat: 40.8296, lon: -73.9262, name: "Yankee Stadium", imageURL: "https://www.wheretraveler.com/sites/default/files/styles/wt17_promoted_large/public/images/YANKEE%20STADIUM_OVE%23747D12.jpg?itok=KHnOsPcI&timestamp=1451406398", day:2, intradayIndex: 1},
        {placeID: "ChIJgzD7uFVYwokavdeEdvGu-wA", type: "start", lat: 40.7829, lon: -73.9654, name: "hotel1", imageURL: "", day:0, intradayIndex: 0},
        {placeID: "ChIJgzcdsFVYwokRXCoEdvGu-aA", type: "start", lat: 40.7829, lon: -73.9654, name: "hotel2", imageURL: "", day:1, intradayIndex: 0},
        {placeID: "ChIJgzD7uFfdskRXCoEdvGud-dv", type: "start", lat: 40.7829, lon: -73.9654, name: "hotel3", imageURL: "", day:2, intradayIndex: 0},
    ];
    totalDays = 0;

    changedPoints = [];

    startPoints = [];

    generatedPoints=[];
    
    run=true;

    stepIndex=0
    

   

    state = {
        points:[],
        //isLoadingInit: false,
        //isGeneratingPath: false,
    }

    componentDidMount() {
        console.log("TravelOverview did mount");
        this.totalDays = this.props.totalDays;
        const temp= this.props.points.filter(place => (place.day) < this.totalDays)
        console.log(temp);
        this.startPoints = this.props.points.filter(place => place['type'] === "start")
        this.setState(
            {
              points: temp,
    })
   }


    componentWillUnmount() {
        console.log("TravelOverview will unmount");
    }

    onDayOptionsChosen = (e) => {
        this.totalDays = parseInt(e.key) + 1;
        const endPoint = 'InitialRecommend';
        console.log(`days: ${this.totalDays}`);
        this.setState((prevState) => {
            return {
                isLoadingInit: true
            }
        })
        fetch(`${API_ROOT}/${endPoint}?userID=${this.props.userID}&totalDays=${this.totalDays}`, {
            method: 'GET',
        }).then((response) => {
            if (response.ok) {
                console.log("load ok")
                return response.json();
            }
        }).then((data) => {
            var temp= data.places.filter(place => (place.day) < this.totalDays)
            console.log(temp);
            this.setState((prevState) => {
                return {
                    points: temp,
                    //isLoadingInit: false
                }
            })

        }).catch((e) => {
            console.log(e.message);
        });

        // for testing
        /*this.setState((prevState) => {
            return {
                points: this.testingPoints
            };
        })*/
    }

    onSavePlacesButtonClick = (placeID, day, intradayIndex) => {
        // Request
        const endPoint = 'UpdateInterestedPlaces';
        let obj = {placeID, day, intradayIndex};
        console.log(JSON.stringify({"userID": this.props.userID, "newSchedule": [obj]}));
        fetch(`${API_ROOT}/${endPoint}`, {
            method: 'POST',
            body: JSON.stringify({"userID": this.props.userID, "newSchedule": [obj]}),
            headers: {
                'Content-Type':'application/json'
            }
        }).catch((e) => {
            console.log(e.message);
        });


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
          else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            // Need to set our running state to false, so we can restart if we click start again.
            this.setState({ run: false });
          }
      
          console.groupCollapsed(type);
          console.log(data); //eslint-disable-line no-console
          console.groupEnd();
      };

    handleOnDayChange = (pointId, day) => {
        let dayNum = parseInt(day);
        //this.changedPoints.push({placeID: pointId, day: dayNum});
        var points = this.state.points;
        for (let i in points) {
            if (points[i]['placeID'] === pointId) {
                points[i]['day'] = dayNum;
                continue;
            }
        }

        this.setState((prevState) => {
            return {
                points:points.filter(point => point.day !== -1)
            };
        });

        this.onSavePlacesButtonClick(pointId, day, -1);
    }

    addStartPoint = (obj) => {
        let replaced = false;
        for (let i = 0; i < this.startPoints.length; i++) {
            const day = this.startPoints[i].day;
            if (day === obj.day) { // if exist, replace
                this.startPoints[i] = obj;
                replaced = true;
                break;
            }
        }
        if (!replaced) {
            this.startPoints.push(obj);
        }
        const poiPoints = this.state.points.filter(place => place['type'] === "poi")
        this.setState((prevState) => {
            return {
                points:[...poiPoints, ...this.startPoints],
            };
        });

    }

    handleGeneratePathsObtained = (generatedPoints) => {
        this.props.homeCallback(generatedPoints, this.totalDays);
    }

    render() {
        const dayOptionsMenu = (
            <Menu
                onClick={this.onDayOptionsChosen}
            >
                {
                    [...Array(6).keys()].map((i) =>
                        <Menu.Item key={i}>{`${i + 1} Days`}</Menu.Item>
                    )
                }
            </Menu>
        )

        return (
            <div className="top_container">
             {typeof(this.state.toursteps)!=="undefined"&&<Joyride
                  styles={{
                    options: {
                      arrowColor: '#4F6E96',
                      //overlayColor: 'rgba(79, 26, 0, 0.4)',
                      backgroundColor: 'white',
                      primaryColor: '#3A94F5',
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
                <div className="map_container map">
                <WrappedTravelMap 
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCPpNmXCFqrlF4gdU3gEMoGRvqCaqSpyk4&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    points={this.state.points}
                    totalDays={this.totalDays}
                    handleOnDayChange={this.handleOnDayChange}
                />

           
                </div>
                <div className="info" id="overview-info">
                    {
                        this.totalDays>0&&<div style={{position:"absolute",marginLeft:"10px",top:"10px"}}
                                               className="banger">You chose a <b>{this.totalDays}</b> days Trip!</div>
                    }
                        <div style={{position:"absolute",marginLeft:"10px", top:"60px"}}>
                        <Dropdown overlay={dayOptionsMenu} trigger={['click']}>
                            <Button className="button-font" id="day-options" style={{userSelect: 'none'}}>Total Days</Button>
                        </Dropdown>
                        </div>

                        
                        <div style={{visibility: this.totalDays > 0 ? 'visible' : 'hidden', marginTop:'80px',marginLeft:"10px"}}>
                            <TravelStartDayInput totalDays={this.totalDays}
                                                 userID={this.props.userID}
                                                 startPoints={this.startPoints}
                                                 onPlaceChanged={this.addStartPoint}
                                                 onGeneratePathsObtained={this.handleGeneratePathsObtained}/>
                        </div>

                </div>
                <div className="help" style={{ position:"absolute", bottom:"10px", marginLeft:"66%", textAlign:"left" }}>
                    <Button onClick={this.handleJoyrideCallback} style={{"background-color": "lightGrey", }}><Icon type="question-circle"/>Help</Button>
                </div>
            </div>

                

        );
    }
}


