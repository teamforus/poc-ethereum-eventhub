'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

// ERC20 Transfer
var ERC20_TRANSFER_REQUEST = exports.ERC20_TRANSFER_REQUEST = 'requestErc20Transfer';
var ERC20_TRANSFER_SAVED = exports.ERC20_TRANSFER_SAVED = 'savedErc20Transfer';
var ERC20_TRANSFER_EXECUTED = exports.ERC20_TRANSFER_EXECUTED = 'executedErc20Transfer';
var ERC20_TRANSFER_FAILED = exports.ERC20_TRANSFER_FAILED = 'failedErc20Transfer';

// Maintenance
var STATUS_REQUEST = exports.STATUS_REQUEST = 'requestStatus';
var STATUS_RESPONSE = exports.STATUS_RESPONSE = 'status';
var VERSION_REQUEST = exports.VERSION_REQUEST = 'requestVersion';
var VERSION_RESPONSE = exports.VERSION_RESPONSE = 'version';

var Data = exports.Data = {
    AMOUNT: 'amount',
    ERROR_MESSAGE: 'errorMessage',
    EVENT_DATA: 'eventData',
    EVENT_NAME: 'eventName',
    PREVIOUS_EVENT: 'previousEvent',
    SENDER: 'sender',
    STATUS_CODE: 'statusCode',
    STATUS_CODES: {
        ERROR: 'ERROR',
        OFFLINE: 'OFLLINE',
        OK: 'OK'
    },
    TO: 'to',
    VERSION_HOTFIX: 'hotfix',
    VERSION_PATCH: 'patch',
    VERSION_RELEASE: 'release'
};