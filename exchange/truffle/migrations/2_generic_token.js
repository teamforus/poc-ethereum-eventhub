var GenericToken = artifacts.require("./GenericToken.sol");

module.exports = function(deployer) {
  deployer.deploy(GenericToken, "My Generic Token", 41000000000000000000000000);
};
