// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20Token.sol";
import "./ERC721Token.sol";

contract Marketplace {
    ERC721Token public nft;
    ERC20Token public erc20;

    mapping(uint256 => bool) public tokenIdForSale;

    event NFTOnSaleStatus(
        address indexed ownerOfNFT,
        uint256 indexed tokenId,
        bool isOnSale
    );

    event NftTransaktion(
        address indexed buyer,
        address indexed seller,
        uint tokenId,
        uint256 erc20TokensAmount
    );

    constructor(address _nftAddress, address _erc20Address) {
        nft = ERC721Token(_nftAddress);
        erc20 = ERC20Token(payable(_erc20Address));
    }

    function putNFTOnSale(uint256 _tokenId) public onlyOwnerOfNFT(_tokenId) returns (bool) {
        tokenIdForSale[_tokenId] = true;

        emit NFTOnSaleStatus(msg.sender, _tokenId, true);

        return true;
    }

    function removeNFTFromSale (
        uint256 _tokenId
    ) public onlyOwnerOfNFT(_tokenId) returns (bool){
        tokenIdForSale[_tokenId] = false;

        emit NFTOnSaleStatus(msg.sender, _tokenId, false);

        return true;
    }

    function buyNFT(uint256 _tokenId) public returns (bool){
        address _seller = nft.ownerOf(_tokenId);
        require(_seller != address(0), "NFT does not exist");
        require(tokenIdForSale[_tokenId], "NFT is not on sale");
        require(
            nft.getApproved(_tokenId) == address(this),
            "NFT transfer not approved"
        );
        uint256 erc20TokensAmount = nft.cost() * erc20.tokensPerEth();
        require(
            erc20.balanceOf(msg.sender) >= erc20TokensAmount,
            "Not enough erc20 tokens on your balance to buy NFT"
        );
        erc20.transferFrom(msg.sender, _seller, erc20TokensAmount);
        nft.transferFrom(_seller, msg.sender, _tokenId);

        tokenIdForSale[_tokenId] = false;

        emit NftTransaktion(msg.sender, _seller, _tokenId, erc20TokensAmount);

        return true;
    }

    modifier onlyOwnerOfNFT(uint256 _tokenId) {
        require(
            nft.ownerOf(_tokenId) == msg.sender,
            "You are not owner of this NFT"
        );
        _;
    }
}
