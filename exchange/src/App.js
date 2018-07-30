import React, { Component } from 'react';
import './App.css';
import { Provider } from './utils';

import EtherBalance from './Components/EtherBalance';
import ERC20List from './Components/ERC20List';

class App extends Component {

  constructor() {
    super();
    const config = require('./config.json');
    const provider = new Provider(config);
    //web3.setProvider(eventHubProvider);
    this.state = {
      balance: 0.00,
      coinbase: '0x88e94A4b7BfC62A38D300d98ce1C09f30fb75e3E',
//      web3: web3,
      provider: provider
    };
    this.Web3 = this.Web3.bind(this);

  }

  componentDidMount() {
    this.reloadBalance();
  }

  getNameOfToken = (address) => {
    return this.state.provider.getERC20Name(address);
  }

  reloadBalance() {
    this.state.provider.getERC20Balance(this.state.coinbase).then((balance) => {
      this.setState((state) => {
        state.balance = balance;
        return state;
      });
    });
  }

  Web3() {
    return this.state.web3;
  }

  render() {
    return (
      <div className="app">
        <div className="header">
          Coinbase: {this.state.coinbase}
        </div>
        <EtherBalance balance={this.state.balance} />
        <ERC20List getNameOfToken={this.getNameOfToken} />
      </div>
    );
  }
}

export default App;
