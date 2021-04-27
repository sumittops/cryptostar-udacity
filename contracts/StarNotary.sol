// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {
  struct Star {
    string name;
    bool isStar;
  }

  constructor() ERC721("StarNotary", "SNT") {}
 
  mapping(uint256 => Star) public tokenIdToStarInfo;
  mapping(uint256 => uint256) public starsForSale;


  function isStar(uint256 _tokenId) public view returns (bool) {
    return tokenIdToStarInfo[_tokenId].isStar;
  }

  // Create Star using the Struct
  function createStar(string memory _name, uint256 _tokenId) public {
    require(!isStar(_tokenId), 'Star with given token already claimed');
    Star memory newStar = Star(_name, true);
    tokenIdToStarInfo[_tokenId] = newStar;
    _mint(msg.sender, _tokenId);
  }

  // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
  function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
    require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
    starsForSale[_tokenId] = _price;
  }

  function buyStar(uint256 _tokenId) public  payable {
    require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
    uint256 starCost = starsForSale[_tokenId];
    address ownerAddress = ownerOf(_tokenId);
    require(msg.value > starCost, "You need to have enough Ether");
    payable(ownerAddress).transfer(starCost);
    _transfer(ownerAddress, msg.sender, _tokenId);
    if(msg.value > starCost) {
        payable(msg.sender).transfer(msg.value - starCost);
    }
  }
  
  function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns (string memory){
    require(isStar(_tokenId), "No Star Found for this token '_tokenId'");
    return tokenIdToStarInfo[_tokenId].name;
  }

  function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
      //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
      //2. You don't have to check for the price of the token (star)
      //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId1)
      //4. Use _transferFrom function to exchange the tokens.
      address owner1 = ownerOf(_tokenId1);
      address owner2 = ownerOf(_tokenId2);

      if (msg.sender == owner1 || msg.sender == owner2) {
        _transfer(owner1, owner2, _tokenId1);
        _transfer(owner2, owner1, _tokenId2);
      }
  }
    // Implement Task 1 Transfer Stars
  function transferStar(address _to, uint256 _tokenId) public {
      //1. Check if the sender is the ownerOf(_tokenId)
      //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
      if (ownerOf(_tokenId) == msg.sender) {
        transferFrom(msg.sender, _to, _tokenId);
      }
  }
}