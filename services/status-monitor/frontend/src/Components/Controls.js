import React, { Component } from 'react';
import 'material-design-icons/iconfont/material-icons.css';
import './Controls.css';

class Controls extends Component {

  render() {
    return ( <div className="controls">
        <div className="button refresh">
            <span className="material-icons" onClick={this.props.onRefreshPressed} >cached</span>
        </div>
        <div className="button debug-offline">
            <span className="material-icons" onClick={this.props.onTestOfflinePressed}>wifi</span>
        </div>
        <div className="button debug-error">
            <span className="material-icons" onClick={this.props.onTestErrorPressed}>bug_report</span>
        </div>
        </div>
    );
  }

}

export default Controls;
