import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import config from './config'
import {Route, BrowserRouter as Router} from 'react-router-dom'
import LoginComponent from './login/Login'
import DashboardComponent from './dashboard/Dashboard'
import SignUpComponent from './signup/SignUp'


const firebase = require('firebase');
require('firebase/firestore') 

firebase.initializeApp(config)
const routing = (
  <Router>
    <div id="routing-container">
      <Route path = '/login' component = {LoginComponent}></Route>
      <Route path = '/signup' component = {SignUpComponent}></Route>
      <Route path = '/dashboard' component = {DashboardComponent}></Route>
    </div>
  </Router>
)



ReactDOM.render(routing,document.getElementById('root')
);




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
