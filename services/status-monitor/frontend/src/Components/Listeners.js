import React, { Component } from 'react';
import './Listeners.css';
import Listener from './Listener';

class Listeners extends Component {

  render() {
    const listeners = (Object.keys(this.props.listeners)).map((name) =>
      <Listener key={name} listener={this.props.listeners[name]}/>
    );
    return (
      <div className="listeners">
        {listeners}
      </div>
    );
  }

}

export default Listeners;
