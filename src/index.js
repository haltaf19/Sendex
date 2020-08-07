import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import config from './config'

const firebase = require('firebase');
require('firebase/firestore') 

firebase.initializeApp(config)

ReactDOM.render(
  <React.StrictMode>
    <div> HELLLOOO WORLD!</div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
