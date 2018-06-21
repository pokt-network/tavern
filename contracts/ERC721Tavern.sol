import "openzeppelin-zos/contracts/token/ERC721/ERC721.sol";

/**
 * @title ERC-721 Non-Fungible Token Standard, Tavern extension
 * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721Tavern is ERC721 {

    // Validates the parameters for a new quest
    function validateQuest(string _name, string _hint, uint _maxWinners, bytes32 _merkleRoot, string _metadata) public returns (bool);
}
