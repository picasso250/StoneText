// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract StoneText {
    event StringStored(address indexed user, string str);
    
    function store(string memory str) public {
        emit StringStored(msg.sender, str);
    }
}