pragma solidity ^0.4.24;

/**
 * @title TavernQuestRewardTest
 */
contract TavernQuestRewardTest {

    // Validates the parameters for a new quest
    function validateQuest(address _tavern, address _creator, string _name, string _hint, uint _maxWinners, bytes32 _merkleRoot, string _merkleBody, string _metadata, uint _prize) public returns (bool) {
        return true;
    }

    // Mint reward
    function rewardCompletion(address _tavern, address _winner, uint _questIndex) public returns (bool) {
        return true;
    }
}
