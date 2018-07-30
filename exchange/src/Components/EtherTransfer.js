import React, { Component } from 'react';

class EtherTransfer extends Component {

    render() {
        return (
            <div className="ether-transfer">
                <div className="ether-form-wrapper">
                    <div className="ether-form">
                        <input className="form-to" name="to" type="text" maxLength="42" placeholder="Send ether to..." />
                        <input className="form-amount" name="amount" type="number" placeholder="Amount (in wei)" />
                        <button type="button">Send Ether</button>
                    </div>
                </div>
                <div className="ether-form-loader">
                    Loading...
                </div>
            </div>
        );
    }
}

export default EtherTransfer;