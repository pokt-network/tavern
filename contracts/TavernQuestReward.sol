pragma solidity ^0.4.24;

/**
 * @title TavernQuestReward
 */
contract TavernQuestReward {

    // Validates the parameters for a new quest
    function validateQuest(address _creator, string _name, string _hint, uint _maxWinners, bytes32 _merkleRoot, string _metadata, uint _prize) public returns (bool);

    // Mint reward
    function rewardCompletion(address _tavern, address _winner, uint _questIndex) public returns (bool);
}
