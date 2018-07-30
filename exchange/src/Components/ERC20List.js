import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { EthereumHelper } from '../utils';

import ERC20ListItem from './ERC20ListItem';

class ERC20List extends Component {

    constructor(props) {
        super(props);
        this.getNameOfToken = this.props.getNameOfToken;
        this.findName = this.findName.bind(this);
        this.List = this.List.bind(this);
    }

    addToken = (event) => {
        var tokens = this.getTokens();
        const children = event.target.parentElement.children;
        const name = children.name.value;
        const address = children.address.value;
        if (EthereumHelper.isValidAddress(address)) {
            var exists = false;
            tokens.forEach((token, index) => {
                debugger;
                if (token.address === address) {
                    tokens[index].name = name;
                    exists = true;
                }
            });
            if (!exists) {
                const token = {
                    name: name,
                    address: address
                };
                tokens.push(token);
            }
            const cookies = new Cookies();
            cookies.set('tokens', tokens, { path: '/' });
            children.name.value = "";
            children.address.value = "";
            this.forceUpdate();
        } else {
            alert('Address invalid');
        }
    }

    findName = (event) => {
        const addressField = event.target.parentElement.children.address;
        const nameField = event.target.parentElement.children.name;
        if (EthereumHelper.isValidAddress(addressField.value)) {
            this.getNameOfToken(addressField.value).then((nameOrFalse) => {
                if (!nameOrFalse) {
                    alert('No valid name was found!');
                } else {
                    nameField.value = nameOrFalse;
                }
            });
        } else {
            alert('Address invalid');
        }

    }

    getNameOfToken; // Derived from parent

    getTokens = () => {
        const tokenString = (new Cookies()).get('tokens');
        var tokens = [];
        if (!!tokenString) {
            tokens = tokenString;
            //tokens = JSON.parse(tokenString);
        }
        return tokens;
    }

    List() {
        const tokens = this.getTokens();
        if (tokens.length > 0) {
            const ret = [];
            for (const key in tokens) {
                ret.push(
                    <ERC20ListItem token={tokens[key]} />
                )
            }
            return <ul className="erc20-list">
                {ret}
            </ul>
        } else {
            return (
                <div>No tokens added.</div>
            );
        }
    }

    render() {
        return (
            <div className="erc20-wrapper">
                <this.List />
                <div className="erc20-add-form">
                    <h4>Add token</h4>
                    <input type="text" className="form-address" name="address" placeholder="Address" />
                    <input type="text" className="form-name" name="name" placeholder="Name" />
                    <button className="button-fill-name" onClick={this.findName} >Find name on contract</button>
                    <button className="submit" type="submit" onClick={this.addToken} >Add</button>
                </div>
            </div>
        );
    }
}

export default ERC20List;