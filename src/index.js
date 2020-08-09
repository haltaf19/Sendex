import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import config from './config'
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import LoginComponent from './Login'
import DashboardComponent from './Dashboard'
import SignUpComponent from './signup/SignUp'


const firebase = require('firebase');
require('firebase/firestore') 

firebase.initializeApp(config)
const routing = (
  <Router>
    <div id="routing-container">
      <Switch>
        <Route exact path = '/login' component = {LoginComponent}></Route>
        <Route exact path = '/signup' component = {SignUpComponent}></Route>
        <Route exact path = '/' component = {DashboardComponent}></Route>
      </Switch>
    </div>
  </Router>
)



ReactDOM.render(routing,document.getElementById('root')
);




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
