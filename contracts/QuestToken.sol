pragma solidity ^0.4.2;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
/**
 */
contract QuestToken is ERC721Token, Ownable{
    // Constructor
    function QuestToken() ERC721Token("Quest Token", "QTK") Ownable() public {}

    // mintTo function
    function mintTo(address _to, string _tokenURI) onlyOwner public {
        uint256 newTokenId = allTokens.length;
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
    }
}
