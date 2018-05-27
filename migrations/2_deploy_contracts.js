var Tavern = artifacts.require("./Tavern.sol");

module.exports = function(deployer) {
  deployer.deploy(Tavern);
};
