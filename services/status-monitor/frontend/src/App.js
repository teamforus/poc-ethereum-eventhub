import React, { Component } from 'react';
import './App.css';
import Listeners from './Components/Listeners';

class App extends Component {

  constructor() {
    super();
    this.setupConnection();
    this.state = {
      connection: ConnectionStates.TRYING_TO_CONNECT,
      listeners: {
        "status-monitor-api": {
          name: "status-monitor-api",
          status: "OK"
        },
        "ethereum-listener": {
          name: "ethereum-listener",
          status: "ERROR",
          message: ["Ethereum is not production ready", "Please, try to restart"]
        },
        "log-listener": {
          name: "log-listener",
          status: "OFF"
        }
      }
    }
  }

  HeaderMessage(state) {
    let className = 'header-message ';
    if (state.connection === ConnectionStates.CONNECTION_FAILED) {
      return <div className={className + 'error'}>Unable to make a connection!</div>;
    } else if (state.connection === ConnectionStates.TRYING_TO_CONNECT) {
      return <div className={className + 'warning'}>Trying to connect...</div>;
    } 
    return '';
  }

  render() {
    return (
      <div className="body" onCompositionStart={this.setupConnection}>
        <this.HeaderMessage connection={this.state.connection} />
        <div className="header">
          <h1>Idenity Status Monitor</h1>
        </div>
        <div className="content">
          <Listeners listeners={this.state.listeners}/>
        </div>
      </div>
    );
  }

  setupConnection = () => {
    const connection = new WebSocket('ws://localhost:5100');
    connection.onopen = () => {
      this.setState((prevState) => {
        prevState.connection = ConnectionStates.CONNECTION_OK
        return prevState;
      });
      console.log('Connected to api!');
    }
    connection.onerror = (message) => {
      console.log('error: ' + message);
      this.setState((prevState) => {
        prevState.connection = ConnectionStates.CONNECTION_FAILED;
        return prevState;
      })
    }
    connection.onmessage = (message) => {
      const json = JSON.parse(message.data);
      if (json['type'] === 'history') {
        console.log('Received initial list of listeners: ' + Object.keys(json['history']).join(', '));
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
  }

}

class ConnectionStates {
  static get TRYING_TO_CONNECT() { return 0; }
  static get CONNECTION_OK() { return 1; }
  static get CONNECTION_FAILED() { return 2; }
}

export default App;
