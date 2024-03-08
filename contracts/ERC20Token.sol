// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract ERC20Token is ERC20Capped {
    address public immutable owner;
    uint256 private constant TOKEN_MULTIPLIER = 10; //1 eather = 10 TT

    constructor() ERC20("TestToken", "TT") ERC20Capped(1500 * 10**18) {
        owner = msg.sender;
        _mint(owner, 1000 * 10**18);
    }

    function buyToken() public payable returns (bool) {
        require(msg.value > 0, "Send ETH to buy some tokens");

        uint256 amountToBuy = msg.value * TOKEN_MULTIPLIER;
        uint256 ownerBalance = balanceOf(owner);

        require(
            ownerBalance >= amountToBuy,
            "Contract has not enough tokens"
        );

        _transfer(owner, msg.sender, amountToBuy);

        return true;
    }

    function mint(uint256 amount) external onlyOwner returns (bool) {
        _mint(owner, amount * 10**18);
        return true;
    }

    function burn(uint256 amount) external onlyOwner returns (bool) {
        _burn(owner, amount * 10**18);
        return true;
    }

    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        address spender = msg.sender;

        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
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

