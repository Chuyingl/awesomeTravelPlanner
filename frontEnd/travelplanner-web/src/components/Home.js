import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Navigation from './Navigation';
import Board from './Board';
import { TravelPlan } from './TravelPlan';
import '../styles/App.css';
import {TravelOverview} from './TravelOverview'
import {API_ROOT} from "../constants";
import {Spin} from 'antd';
import { truncateSync } from 'fs';


export class Home extends React.Component{

    state = {
        selectedTab: 'traveloverview',
        fetchFinished: false,
        disableTabs: false
    };

    points = [];
    totalDays = 0;

    componentDidMount() {
        console.log("Home did mount");
        const endPoint = 'GeneratePaths';
        fetch(`${API_ROOT}/${endPoint}?userID=${this.props.userID}`, {
            method: 'GET',
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((data) => {
            //console.log(data);
            //console.log(data.places);
            if (data.places.length !== 0) { // old user has data

                const savedPoints = data.places.filter(place => place['type'] === "poi");
                const startPoints = data.places.filter(place => place['type'] === "start");

                if (startPoints === undefined || startPoints === null || startPoints.length === 0||savedPoints.length===0){
                    this.setState((prevState) => { return {disableTabs: true}});
                } else {
                    this.setState((prevState) => {
                        return {
                            disableTabs: false,
                        };
                    });
                }
                this.totalDays = Math.max.apply(Math, savedPoints.map((o) => {
                    return o.day
                })) + 1;
                this.points = savedPoints;

            }

            this.setState((prev) => {
                return {
                    fetchFinished: true
                };
            });

        }).catch((e) => {
            console.log(e.message);
        });

    }

    componentWillUnmount() {
        console.log("Home will unmount");
    }

    homeCallback = (pts, tds, routeToTravelPlan=true) => {
        //console.log("home callback");
        this.points = pts;
        this.totalDays = tds;
        if (routeToTravelPlan) {
            this.changeTab('travelplan');
        }
        this.setState((prevState) => {
            return {
                disableTabs: false,
            };
        });

    }

    homeTravelPlanCallback = (backendObjArray) => {
        console.log("home-travelplan callback");
        for (let i = 0; i < this.points.length; i++) {
            for (let j = 0; j < backendObjArray.length; j++) {
                if (this.points[i].placeID === backendObjArray[j].placeID) {
                    this.points[i].day = backendObjArray[j].day;
                    this.points[i].intradayIndex = backendObjArray[j].intradayIndex;
                }
            }
        }
        this.setState((prevState) => {
            return {
                disableTabs: false,
            };
        });
    }

    homeBoardCallback = (backendObjArray) => {
        console.log("home-board callback");
        for (let i = 0; i < this.points.length; i++) {
            for (let j = 0; j < backendObjArray.length; j++) {
                if (this.points[i].placeID === backendObjArray[j].placeID) {
                    this.points[i].day = backendObjArray[j].day;
                    this.points[i].intradayIndex = backendObjArray[j].intradayIndex;
                }
            }
        }
        this.setState((prevState) => {
            return {
                disableTabs: false,
            };
        });

    }

    renderOverview() {
        //console.log(this.props)
        return (<TravelOverview points={this.points} totalDays={this.totalDays} userID={this.props.userID} homeCallback={this.homeCallback}/>)
    }
    renderPlanDetails() {
        return (
            <Board points={this.points} totalDays={this.totalDays} userID={this.props.userID} homeBoardCallback={this.homeBoardCallback}/>
        );
        //return (<TestPage points={this.points} totalDays={this.totalDays}/>);
    }
    renderTravelPlan() {
       return (<TravelPlan points={this.points} totalDays={this.totalDays} userID={this.props.userID} homeTravelPlanCallback={this.homeTravelPlanCallback}/>);
    }
    renderNavigation() {
      return (
          <Navigation
            onClick={(tabName) => this.changeTab(tabName)}
            selectedTab={this.state.selectedTab}
            disable={this.state.disableTabs}
          />
      );
    }

    renderTabContent() {
      switch (this.state.selectedTab) {
        case 'traveloverview':
        default:
          return this.renderOverview();
        case 'details':
          return this.renderPlanDetails();
        case 'travelplan':
        return this.renderTravelPlan();
      }
    }

    changeTab(tabName) {
      this.setState((prevState) => {
          return {
              selectedTab: tabName,
          };
      });
    }

    render() {
      return (
        <div className="App Re-App Page" >
            <div id="nav_contain" style={{position:"absolute"}}>
            {this.renderNavigation()}

            </div>
            {this.state.fetchFinished ?
                <div className="App-body" style={{width:"100%"}} >
                    {this.renderTabContent()}
                </div>
                : <Spin tip="Getting user data..."/>
            }
        </div>
      );
    }
}