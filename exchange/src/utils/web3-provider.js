
import { BigNumber } from 'bignumber.js';
import { EthereumHelper } from './';

class Web3Provider {

    web3 = null;
    constructor(config) {
        const Web3 = require('web3');
        this.web3 = new Web3();
        this.web3.setProvider(config['web3']['node']);
    }

    /**
     * Get the balance of a person in an ERC20 contract or in Ether. 
     * @param {string} address The address of the person to check balance.
     * @param {string?} token The address of the token. If left empty, or if given a falsy-value, 
     * the balance of the person's Ether will be returned. 
     * @returns {Promise<String>} A displayable string with the value of the balance.
     */
    getERC20Balance(address, token = undefined) {
        // If the token is empty, it will get the Ether balance of address
        if (!token) {
            return this.getEtherBalance(address);
        } else {
            const contract = getTokenContract(this.web3, token);
            return this.web3.eth.call({
                to: token,
                data: contract.methods.balanceOf(address).encodeABI()
            }).then((balanceHex) => {
                if (balanceHex === '0x') return '0';
                return BigNumber(balanceHex.toString());
            }).catch((error) => {
                console.error(error);
                return 'An error occurred...';
            });
        }
    }

    /**
     * Get the 'decimals' value of an ERC20 contract, or the default 
     * if the contract does not support the decimals-value. 
     * @param {string} address The address of the contract. 
     */
    getERC20Decimals(address) {
        const contract = getTokenContract(this.web3, address);
        return this.web3.eth.call({
            to: address,
            data: contract.methods.decimals().encodeABI()
        }).catch(() => {
            console.log('Contract with address "' + address + '" has no decimals value. Returning default instead.');
            return DEFAULT_DECIMALS;
        });
    }

    /**
     * Calls an ERC20-contract for the optional name of the token.
     * @param {string} address The address of the token
     * @returns {Promise<String|Boolean>} A promise containing the name of the contract, or false if 
     * the method did not exist on the contract
     */
    getERC20Name(address) {
        const contract = getTokenContract(this.web3, address);
        debugger;
        return this.web3.eth.call({
            to: address,
            data: contract.methods.name().encodeABI()
        }).catch(() => {
            console.log('Contract with address "' + address + '" has no decimals value. Returning default (' + DEFAULT_DECIMALS + ') instead.');
            return false;
        });
    }

    /**
     * 
     * @param {string} address The address
     * @returns {Promise<String>} The display value of the balance.
     */
    getEtherBalance(address) {
        return this.web3.eth.getBalance(address).then((balance) => {
            balance = EthereumHelper.formatToDecimal(balance, DEFAULT_DECIMALS);
            return balance;
        });
    }
    transferERC20(address, to, amount) { }
    transferEther(address, to, amount) { }
}

const DEFAULT_DECIMALS = 18;

function getTokenContract(web3, address) {
    return new web3.eth.Contract(
        [{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"totalSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
        ,
        address,
        null
    );
}
export default Web3Provider;