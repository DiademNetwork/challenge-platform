pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract ChallengeToken is ERC721Token, Ownable {
    mapping (uint256 => bool) public isCommunityChallenge;
    mapping (uint256 => string) public titles;
    mapping (uint256 => mapping (address => uint256)) public rewards;
    mapping (uint256 => mapping (address => bool)) public confirmations;
    mapping (uint256 => uint256) public totalRewards;

    function create(string _title, bool _isCommunityChallenge) external {
        uint256 index = allTokens.length + 1;

        _mint(msg.sender, index);

        titles[index] = _title;
        isCommunityChallenge[index] = _isCommunityChallenge;

        BoughtToken(msg.sender, index);
    }

    function createWithReward(string _title, bool _isCommunityChallenge, uint256 _amount, address _verifier) payable {
        require(msg.value == _amount);
        require(confirmations[index][_verifier] == false);

        uint256 index = allTokens.length + 1;

        _mint(msg.sender, index);

        titles[index] = _title;

        rewards[index][_verifier] += msg.value;
        totalRewards[index] += msg.value;

        isCommunityChallenge[index] = _isCommunityChallenge;

        BoughtToken(msg.sender, index);
    }

    function confirm(uint256 _index) {
        confirmations[_index][msg.sender] = true;
    }

    function addReward(uint256 _index, uint256 _amount, address _verifier) payable {
        require(msg.value == _amount);

        require(confirmations[_index][_verifier] == false);

        rewards[_index][_verifier] += _amount;
        totalRewards[_index] += _amount;
    }

    function claimReward(uint256 _index, address _verifier) {
        require(ownerOf(_index) == msg.sender);
        require(confirmations[_index][_verifier] == true);

        uint256 reward = rewards[_index][_verifier];

        rewards[_index][_verifier] = 0;
        totalRewards[_index] -= reward;

        msg.sender.transfer(reward);
    }

    function acceptChallenge(uint256 _index) {
        ChallengeAccepted(msg.sender, _index);
    }

    function myTokens() external view returns (uint256[])
    {
        return ownedTokens[msg.sender];
    }

    function getToken(uint256 _tokenId) external view
        returns (bool tokenType_, string tokenTitle_, uint256 tokenReward_)
    {
        tokenType_ = isCommunityChallenge[_tokenId];
        tokenTitle_ = titles[_tokenId];
        tokenReward_ = totalRewards[_tokenId];
    }

    function ChallengeToken() ERC721Token("Challenge Token", "CDO") public {
    }

    // listen to event => check social wall => transfer token
    event ChallengeAccepted(address _person, uint256 _index);
    event BoughtToken(address indexed buyer, uint256 tokenId);
}