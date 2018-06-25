pragma solidity ^0.4.25;

/**
 * @title TavernQuestReward
 */
contract TavernQuestReward {

    // Validates the parameters for a new quest
    function validateQuest(string _name, string _hint, uint _maxWinners, bytes32 _merkleRoot, string _metadata) public returns (bool);

    // Mint reward
    function rewardCompletion(address _tavern, address _winner, uint _questIndex, uint _winnerIndex) public returns (bool);
}
