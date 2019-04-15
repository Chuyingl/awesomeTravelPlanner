import React from 'react';
import { Marker, InfoWindow, OverlayView } from "react-google-maps";
import { Menu, Dropdown, Select} from 'antd';
import {LOC_SHAKE} from "../constants"

import blueMarkerUrl from '../assets/images/blue-marker.svg';
import blackMarkerUrl from '../assets/images/black-marker.png';
import rightClickIconUrl from '../assets/images/rightClickIcon.png';

const {Option} = Select;

export class TravelMarker extends React.Component {
    state = {
        isOpen:false,
        isOptionOpen:false
    }

    onToggleOpen = () => {
        this.setState((prevState) => {
            return {
                isOpen: true,
            }
        });

    }

    onToggleClose = () => {
        this.setState((prevState) => {
            return {
                isOpen: false,
            }
        });

    }

    onOptionOpen = () => {
        console.log('onOptionOpen');
        this.setState((prevState) => {
            return {
                isOptionOpen: true,
            }
        });

    }

    onOptionClick = (e) => {
        console.log('click', e);
        this.setState((prevState) => {
            return {
                isOptionOpen: true
            }
        });
        this.props.onDayChange(this.props.point.placeID, e.key);
    }

    setWrapperRef = (node) => {
        this.wrapperRef = node;
    }

    handleClickOutside = (event)=> {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState((prevState) => {
                return {
                    isOptionOpen: false
                }
            });
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        const {type, lat, lon, name, imageURL, day, intradayIndex} = this.props.point;
        //console.log(name);
        const totalDays = this.props.totalDays;

        const menu = (
            <Menu
                onClick={this.onOptionClick}
            >
                <Menu.Item key={-1}>Delete</Menu.Item>
                {
                    [...Array(totalDays).keys()].filter((i) => i !== parseInt(day)).map((i)=>
                        <Menu.Item key={i}>{`Change to Day ${i + 1}`}</Menu.Item>)

                }
            </Menu>
        )

        const getPixelPositionOffset = (width, height) => ({
            x: +5,
            y: -10,
        })


        return (
            <div>

                <Marker
                    position={{ lat: type === "start" ? lat+LOC_SHAKE*day : lat, lng: type === "start" ? lon+LOC_SHAKE*day:lon}}
                    onClick={this.onToggleOpen}
                    onRightClick={this.onOptionOpen}
                    icon={{url: type === 'start' ? require(`../assets/images/start-c${day+1}-marker.svg`) : require(`../assets/images/c${day+1}-marker.svg`),
                          scaledSize: new window.google.maps.Size(26, 41)}}
                >
                    {this.state.isOpen ?
                        <InfoWindow onCloseClick={this.onToggleClose}>
                            <div>
                                { imageURL !== undefined && imageURL !== null && imageURL !== "" ?
                                    <img src={imageURL} alt={name} className="travel-marker-image"/> : null
                                }
                                <p>{`Day ${day + 1}: ${name}`}</p>
                                <a className="btn btn-success" href={`https://en.wikipedia.org/wiki/${name}`} target ="_blank">Learn More</a>
                            </div>
                        </InfoWindow> : null
                    }

                    {this.state.isOptionOpen && type !== 'start' ?
                        <OverlayView
                            position={{lat: lat, lng: lon}}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            getPixelPositionOffset={getPixelPositionOffset}
                        >
                            <div ref={this.setWrapperRef}>
                                {menu}
                            </div>

                        </OverlayView> : null
                    }

                </Marker>

            </div>
        );
    }
}