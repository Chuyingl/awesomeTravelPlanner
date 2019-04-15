import React from 'react';
import logo from "../assets/images/logo.png";
import '../styles/App.css';
import { Icon } from 'antd'

export class Header extends React.Component {
    render() {
        return (
            <header className="App-header">

                <h1 className="App-title satisfy">
                    {' '}Travel Planner
                </h1>
                {
                    this.props.isLoggedIn ?
                        <div className="welcomeLogoutContainer">
                        <a onClick={this.props.handleLogout} className="logout">
                            <span id="welcome">Welcome {this.props.userID}  </span>
                            <br></br>
                            <Icon type="logout"/>{' '}Logout
                        </a>

                        </div> : null
                }

            </header>
        );
    }
}