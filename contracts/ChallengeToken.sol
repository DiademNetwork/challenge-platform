pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract ChallengeToken is ERC721Token, Ownable {
    mapping (uint256 => bool) public isCommunityChallenge;
    mapping (uint256 => string) public titles;
    mapping (uint256 => mapping (address => uint256)) public rewards;
    mapping (uint256 => address[]) public verifiers;
    mapping (uint256 => mapping (address => bool)) public confirmations;
    mapping (uint256 => uint256) public totalRewards;

    function create(string _title, bool _isCommunityChallenge) external {
        uint256 index = allTokens.length + 1;

        _mint(msg.sender, index);

        titles[index] = _title;
        isCommunityChallenge[index] = _isCommunityChallenge;

        BoughtToken(msg.sender, index);
    }

    function createWithReward(string _title, bool _isCommunityChallenge, uint256 _amount, address _verifier) payable external {
        require(msg.value == _amount);
        require(confirmations[index][_verifier] == false);

        uint256 index = allTokens.length + 1;

        _mint(msg.sender, index);

        titles[index] = _title;

        totalRewards[index] += msg.value;

        if (rewards[index][_verifier] == 0) {
            verifiers[index].push(_verifier);
            rewards[index][_verifier] = msg.value;
        } else {
            rewards[index][_verifier] += msg.value;
        }

        isCommunityChallenge[index] = _isCommunityChallenge;

        BoughtToken(msg.sender, index);
    }

    function confirm(uint256 _index) external {
        confirmations[_index][msg.sender] = true;
    }

    function addReward(uint256 _index, uint256 _amount, address _verifier) payable external {
        require(msg.value == _amount);

        require(confirmations[_index][_verifier] == false);

        if (rewards[_index][_verifier] == 0) {
            verifiers[_index].push(_verifier);
            rewards[_index][_verifier] = msg.value;
        } else {
            rewards[_index][_verifier] += msg.value;
        }
    }

    function claimReward(uint256 _index, address _verifier) external {
        require(ownerOf(_index) == msg.sender);
        require(confirmations[_index][_verifier] == true);

        uint256 reward = rewards[_index][_verifier];

        rewards[_index][_verifier] = 0;
        totalRewards[_index] -= reward;

        msg.sender.transfer(reward);
    }

    function acceptChallenge(uint256 _index) external returns (bool) {
        if (isCommunityChallenge[_index] == true) {
            ChallengeAccepted(msg.sender, _index);
            return true;
        } else {
            return false;
        }
    }

    function myTokens() external view returns (uint256[])
    {
        return ownedTokens[msg.sender];
    }

    function getToken(uint256 _tokenId) external view
        returns (bool tokenType_, string tokenTitle_, uint256 tokenReward_, address[] verifiers_)
    {
        tokenType_ = isCommunityChallenge[_tokenId];
        tokenTitle_ = titles[_tokenId];
        tokenReward_ = totalRewards[_tokenId];
        verifiers_ = verifiers[_tokenId];
    }

    function ChallengeToken() ERC721Token("Challenge Token", "CDO") public {
    }

    // listen to event => check social wall => transfer token
    event ChallengeAccepted(address _person, uint256 _index);
    event BoughtToken(address indexed buyer, uint256 tokenId);
}