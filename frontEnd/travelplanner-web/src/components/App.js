import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/App.css';
import { Header} from "./Header"
import { Main } from "./Main"
import { TOKEN_KEY} from "../constants"
import {TravelPlan} from "./TravelPlan"
import {SortableComponent} from "./SortableList"
import { TravelOverview } from './TravelOverview';
    


class App extends Component {

    state = {
        //isLoggedIn: Boolean(localStorage.getItem('TOKEN_KEY'))
        isLoggedIn:false, // for testing login without JWT
        // isLoggedIn:true // for testing bypass login
        userID: ""
    }

    handleLogin = (token, userid) => {
        //localStorage.setItem('TOKEN_KEY', token);

        this.setState({isLoggedIn: true, userID: userid});
    }

    handleLogout = () => {
        //localStorage.removeItem(TOKEN_KEY);
        this.setState({isLoggedIn: false});
    }

    render() {
        return (
            <div className="App" id="App_div">
                <Header isLoggedIn={this.state.isLoggedIn} handleLogout={this.handleLogout} userID={this.state.userID}/>
                <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin} userID={this.state.userID}/>
            </div>

        );
    }


}

export default App;
