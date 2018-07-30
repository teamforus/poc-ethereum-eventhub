import React, { Component } from 'react';

class ERC20ListItem extends Component {

    render() {
        return (
            <li className="erc20-token">
                {this.props.token.name} ({this.props.token.address})
            </li>
        );
    }
}

export default ERC20ListItem;