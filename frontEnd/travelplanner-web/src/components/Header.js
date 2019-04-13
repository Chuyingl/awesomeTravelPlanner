import React from 'react';
import logo from "../assets/images/logo.png";
import '../styles/App.css';
import { Icon } from 'antd'

export class Header extends React.Component {
    render() {
        return (
            <header className="App-header">

                <h1 className="App-title satisfy">{' '}Travel Planner</h1>
                {
                    this.props.isLoggedIn ?
                        <a onClick={this.props.handleLogout} className="logout">
                            <Icon type="logout"/>{' '}Logout
                        </a> : null
                }

            </header>
        );
    }
}