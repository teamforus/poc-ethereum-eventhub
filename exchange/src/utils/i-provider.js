
class IProvider {
    getERC20Balance(address){requireImplementation()}
    getERC20Name(address){requireImplementation()}
    getEtherBalance(address){requireImplementation()}
    transferERC20(address, to, amount){requireImplementation()}
    transferEther(address, to, amount){requireImplementation()}

}
function requireImplementation() {
    console.error(
        'Method not implemented!'
    );
}

export default IProvider;   