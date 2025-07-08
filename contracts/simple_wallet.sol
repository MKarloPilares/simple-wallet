// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleWallet {
    address public owner;

    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint amount) external {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(amount);
        emit Withdrawal(owner, amount);
    }

    function checkBalance() external view returns (uint) {
        return address(this).balance;
    }
}
