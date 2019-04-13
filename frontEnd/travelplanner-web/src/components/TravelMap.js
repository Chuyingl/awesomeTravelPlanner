import React from 'react';
import { Marker,DirectionsRenderer,withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { Polyline } from "react-google-maps"
import { POS_KEY } from "../constants";
import { TravelMarker } from "./TravelMarker";
import { relative } from 'path';
import { Spin } from 'antd';

class TravelMap extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    saveMapRef = (mapInstance) => {
        this.map = mapInstance;
    }

    render() {
        return (
            <GoogleMap
                defaultZoom={12}
                center={{ lat: 40.7795, lng: -73.9680 }}
                ref={this.saveMapRef}
            >
                {this.props.isLoadingInit ?
                    <Spin tip="Getting Recommended Places..."/> : null
                }

                {this.props.isGeneratingPath ?
                    <Spin tip="Generating Paths..."/> : null
                }

                {(this.props.points || []).map((point) => {
                    return (
                        <TravelMarker
                            key={`${point.placeID}${point.day}`}
                            point={point}
                            totalDays={this.props.totalDays}
                            onDayChange={this.props.handleOnDayChange} />
                    )
                })}

                 {
                     
                (this.props.directions)&&
                <DirectionsRenderer directions={this.props.directions} suppressMarkers={this.props.markers}
                 //options={{
                   // markerOptions: { icon: {url:require(`../assets/images/Flag_2.png`)}} ,
                    //icon: { scale: 30}
                  />
                } 
    
             </GoogleMap>
        );
    }
}

export const WrappedTravelMap = withScriptjs(withGoogleMap(TravelMap));
