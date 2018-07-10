pragma solidity ^0.4.17;

contract GenericToken {

    string private _name;
    uint private _totalSupply;
    mapping (address => uint) _balances;
    mapping (address => mapping(address => uint)) _allowances;
    uint8 public constant decimals = 18;  // 18 is the most common number of decimal places


    constructor(string name, uint totalSupply) public {
        _name = name;
        _totalSupply = totalSupply;
        _balances[msg.sender] = totalSupply;
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return _balances[tokenOwner];
    }

    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return _allowances[tokenOwner][spender];
    }

    function transfer(address to, uint tokens) public returns (bool success) {
        require(_balances[msg.sender] >= tokens);
        _balances[msg.sender] -= tokens;
        _balances[to] += tokens;
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    function approve(address spender, uint tokens) public returns (bool success) {
        require(_allowances[msg.sender][spender] + _balances[msg.sender] >= tokens);
        _balances[msg.sender] -= (tokens - _allowances[msg.sender][spender]);
        _allowances[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        require(_allowances[from][msg.sender] >= tokens);
        _allowances[from][msg.sender] -= tokens;
        _balances[to] += tokens;
        emit Transfer(from, to, tokens);
        return true;
    }

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}