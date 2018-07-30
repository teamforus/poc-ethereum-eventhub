import React, { Component } from 'react';

class EtherBalance extends Component {

    render() {
      return (
        <div className="balance">
          <span>{this.props.balance}</span>
        </div>
      );
    }
  }

  export default EtherBalance;