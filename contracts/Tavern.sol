pragma solidity ^0.4.2;

import "./QuestToken.sol";
import "openzeppelin-solidity/contracts/MerkleProof.sol";

contract Tavern {

    // Quest model
    struct Quest {
        address creator;
        uint id;
        string name;
        string hint;
        bytes32 merkleRoot;
        uint numTokens;
        string uri;
        address[] winners;
    }

    // State
    mapping (uint => Quest) public quests;
    uint[] public questsIndex;
    QuestToken public questToken;

    // Constructor
    function Tavern() public {
        questToken = new QuestToken();
    }

    // Creates a new quest
    function createQuest(string _name, string _hint, uint _numTokens, bytes32 _merkleRoot, string _uri) public {
        Quest memory newQuest;
        uint256 questId = questsIndex.length;
        newQuest.creator = msg.sender;
        newQuest.id = questId;
        newQuest.name = _name;
        newQuest.hint = _hint;
        newQuest.merkleRoot = _merkleRoot;
        newQuest.uri = _uri;
        newQuest.numTokens = _numTokens;
        quests[questId] = newQuest;
        questsIndex.push(questId);
    }

    // Submits proof of quest completion and mints reward
    function submitProof(uint _questID, bytes32[] _pathToRoot, bytes32 _proof) public {
        // Avoid creating more winners after the max amount of tokens are minted
        require(quests[_questID].winners.length < quests[_questID].numTokens);

        // Avoid the same winner spamming the contract
        for (uint i = 0; i < quests[_questID].winners.length; i++) {
            require(msg.sender != quests[_questID].winners[i]);
        }

        // Verify merkle proof and mint reward
        if(MerkleProof.verifyProof(_pathToRoot, quests[_questID].merkleRoot, _proof)){
            questToken.mintTo(msg.sender, quests[_questID].uri);
            quests[_questID].winners.push(msg.sender);
        }
    }

    // Get the quest lists (quest ids)
    function getQuestList() public constant returns (uint[]) {
        return questsIndex;
    }

    // Get the quest data
    function getQuest(uint _questID) public constant returns (address creator, uint id, string name, string hint, bytes32 merkleRoot, uint numTokens, string uri) {
        return (quests[_questID].creator, quests[_questID].id, quests[_questID].name, quests[_questID].hint, quests[_questID].merkleRoot, quests[_questID].numTokens, quests[_questID].uri);
    }

    // Get QuestToken address
    function getQuestTokenAddress() public constant returns (address) {
        return address(questToken);
    }
}
