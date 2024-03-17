// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC721Token is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.01 ether;
    uint256 public maxSupply = 99;
    uint256 public maxMintAmount = 5;
    bool public paused = false;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        setBaseURI(_initBaseURI);
    }

    function mint(uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();

        require(!paused, "Minting is paused");
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount, "User can mint from 1 to 5 NFTs at once");
        require(supply + _mintAmount <= maxSupply, "Total supply exceeded");

        if (msg.sender != owner()) {
            require(msg.value >= cost * _mintAmount, "Insufficient ammount");
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(
        string memory _newBaseExtension
    ) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function withdraw() public payable onlyOwner {
        (bool result, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(result, "Withdraw failed");
    }
}
