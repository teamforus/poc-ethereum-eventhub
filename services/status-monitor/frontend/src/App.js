import React, { Component } from 'react';
import './App.css';
import Controls from './Components/Controls';
import Listeners from './Components/Listeners';

class App extends Component {

  constructor() {
    super();
    this.state = {
      connection: this.setupConnection(),
      connectionState: ConnectionStates.TRYING_TO_CONNECT,
      listeners: {}
    }
    this.refresh = this.refresh.bind(this);
    this.sendToApi = this.sendToApi.bind(this);
    this.testError = this.testError.bind(this);
    this.testOffline = this.testOffline.bind(this);
  }

  HeaderMessage(state) {
    let className = 'header-message ';
    if (state.connectionState === ConnectionStates.CONNECTION_FAILED) {
      return <div className={className + 'error'}>Unable to make a connection!</div>;
    } else if (state.connectionState === ConnectionStates.TRYING_TO_CONNECT) {
      return <div className={className + 'warning'}>Trying to connect...</div>;
    }
    return '';
  }

  refresh() {
    this.sendToApi({ request: 'refresh' });
  }

  render() {
    return (
      <div className="body">
        <this.HeaderMessage connectionState={this.state.connectionState} />
        <div className="header">
          <h1>Idenity Status Monitor</h1>
        </div>
        <div className="content">
          <Listeners listeners={this.state.listeners} />
        </div>
        <Controls onRefreshPressed={this.refresh} onTestOfflinePressed={this.testOffline} onTestErrorPressed={this.testError} />
      </div>
    );
  }

  sendToApi(json) {
    if (this.state.connection.readyState !== 1) {
      this.setState((prevState) => {
        prevState.state.connectionState = this.ConnectionStates.TRYING_TO_CONNECT;
        return prevState;
      })
      this.setState((prevState) => {
        prevState.connection = this.setupConnection();
        return prevState;
      });
    }
    this.state.connection.send(JSON.stringify(json));
  }

  setupConnection = () => {
    const connection = new WebSocket('ws://localhost:5100');
    connection.onopen = () => {
      this.setState((prevState) => {
        prevState.connection = connection;
        prevState.connectionState = ConnectionStates.CONNECTION_OK
        return prevState;
      });
      console.log('Connected to api!');
    }
    connection.onerror = (message) => {
      console.log('error: ' + message);
      this.setState((prevState) => {
        prevState.connectionState = ConnectionStates.CONNECTION_FAILED;
        return prevState;
      })
    }
    connection.onmessage = (message) => {
      const json = JSON.parse(message.data);
      if (json['type'] === 'history') {
        console.log('Received initial list of listeners: ' + Object.keys(json['history']).join(', '));
        //console.log('Raw data: ' + JSON.stringify(json));
        this.setState((prevState) => {
          prevState.listeners = json['history'];
          return prevState;
        });
      } else {
        //this.state.listeners[json['name']] = json;
        this.setState((prevState, props) => {
          return prevState.listeners[json.name] = json
        });
      }
    };
    return connection;
  }

  testError() {
    this.sendToApi({ request: 'testError' });
  }

  testOffline() {
    this.sendToApi({ request: 'testOffline' });
  }

}

class ConnectionStates {
  static get TRYING_TO_CONNECT() { return 0; }
  static get CONNECTION_OK() { return 1; }
  static get CONNECTION_FAILED() { return 2; }
}

export default App;
