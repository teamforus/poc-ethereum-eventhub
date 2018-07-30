import React, { Component } from 'react';

class EtherTransfer extends Component {

    render() {
        return (
            <div className="erc20-transfer">
                <div className="erc20-form-wrapper">
                    <div className="erc20-form">
                        <input className="form-to" name="to" type="text" maxLength="42" placeholder="Send to..." />
                        <input className="form-amount" name="amount" type="number" placeholder="Amount (in wei)" />
                        <button type="button">Send</button>
                    </div>
                </div>
                <div className="erc20-form-loader">
                    Loading...
                </div>
            </div>
        );
    }
}

export default EtherTransfer;