import React, { Component } from 'react';

class ERC20Balance extends Component {

    render() {
      return (
        <div className="balance">
          <span>{this.props.name}: {this.props.balance}</span>
        </div>
      );
    }
  }

  export default ERC20Balance;