// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract ERC20Token is ERC20Capped {
    address payable public immutable owner;
    uint256 public tokensPerEth = 100;
    constructor() ERC20("TestToken", "TT") ERC20Capped(1500 * 10 ** 18) {
        owner = payable(msg.sender);
        _mint(owner, 1000 * 10 ** 18);
    }

    function buyToken() public payable returns (bool) {
        require(msg.value > 0, "Not enough ETH to buy tokens");

        uint256 amountToBuy = msg.value * tokensPerEth;
        uint256 ownerBalance = balanceOf(owner);

        require(ownerBalance >= amountToBuy, "Contract has not enough tokens");

        _transfer(owner, msg.sender, amountToBuy );

        return true;
    }

    function mint(uint256 amount) external onlyOwner returns (bool) {
        _mint(owner, amount * 10 ** 18);
        return true;
    }

    function burn(uint256 amount) external onlyOwner returns (bool) {
        _burn(owner, amount * 10 ** 18);
        return true;
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(msg.sender, recipient, amount * 10 ** 18);
        return true;
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        _approve(msg.sender, spender, amount * 10 ** 18);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        address spender = msg.sender;

        _spendAllowance(from, spender, amount * 10 ** 18);
        _transfer(from, to, amount * 10 ** 18);
        return true;
    }

    function withdraw() public payable onlyOwner {
        (bool result, ) = payable(owner).call{value: address(this).balance}("");
        require(result, "Withdraw failed");
    }

    receive() external payable {
        buyToken();
    }

    fallback() external payable {
        buyToken();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Invalid Owner");
        _;
    }
}
