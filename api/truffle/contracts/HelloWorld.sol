pragma solidity ^0.4.23;

contract HelloWorld {

    event MessageSet(string by, string newMessage);

    string private _person;
    string private _message;

    constructor() public {
        setMessage("Max", "At least we are learning");
    }

    function getMessage() public view returns (string person, string message) {
        return (_person, _message);
    }

    function setMessage(string by, string message) public {
        _person = by;
        _message = message;
        emit MessageSet(by, message);
    } 
}