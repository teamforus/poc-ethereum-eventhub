
class EthereumHelper {

    /**
     * Formats a character to have a decimal somewhere. Easy for displaying Ether when 
     * wei is given, for example. 
     * @param {string} number The number as a string
     * @param {number} decimals The amount of decimals after the dot
     * @param {string} decimalCharacter The actual decimal (either '.' or ',')
     * @returns The formatted string with the decimals.
     */
    static formatToDecimal(number, decimals, decimalCharacter = '.') {
        var ret = false;
        const length = (number.length || 0);
        if (length < decimals) {
            const desiredLength = decimals - length;
            ret = '0' + decimalCharacter + '0'.repeat(desiredLength) + number;
        } else if (length === decimals) {
            ret = "0" + decimalCharacter + number;
        } else {
            const placeOfDecimal = number.length - decimals;
            const preDecimal = number.slice(0, placeOfDecimal);
            const postDecimal = number.slice(placeOfDecimal);
            ret = preDecimal + decimalCharacter + postDecimal;
        }
        return ret;
    }

    /**
     * Checks if string is valid Ethereum address
     * @param {string} address 
     * @returns True or False, based on whether the address is valid or not. 
     */
    static isValidAddress(address) {
        return (!!address && address.length === 42 && !!address.substring && address.substring(0,2) === '0x');
    }

    /**
     * Converts Ethereum-returned bytecodes (ETH.string) to readable strings
     * @param {string} bytecode 
     * @returns {string} The converted string in ASCII-readable text
     */
    static byteToAscii(bytecode) {
        if (bytecode.startsWith('0x')) bytecode.substring(2);
        var ret = '';
        for (var character in bytecode) {
            // TODO
            String.fromCharCode()
        }
    }
}

export default EthereumHelper;