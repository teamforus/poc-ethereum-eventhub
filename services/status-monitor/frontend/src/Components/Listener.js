import React, { Component } from 'react';
import './Listener.css';

class Listener extends Component {

  className() {
    let ret = [];
    let classNames = {
      'listener': true,
      'green': this.props.listener.status === 'OK',
      'red': this.props.listener.status === 'ERROR',
      'grey': this.props.listener.status === 'OFFLINE'
    };
    Object.keys(classNames).forEach((name) => {
      if (!!classNames[name]) ret.push(name);
    });
    return ret.join(' ');
  }

  render() {
    return (
      <div className={this.className()}>
        <div className="name">
          {this.props.listener.name}
        </div>
        <div className="version">
          Version
        </div>
      </div>
    );
  }

}

export default Listener;
