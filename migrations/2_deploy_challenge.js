const ChallengeToken = artifacts.require("ChallengeToken")

module.exports = function(deployer) {
  deployer.deploy(ChallengeToken)
}