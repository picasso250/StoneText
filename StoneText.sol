// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoneText {
    string private storedString;
    
    event StringStored(address indexed user, string str);
    
    function store(string memory str) public {
        storedString = str;
        emit StringStored(msg.sender, str);
    }
    
    function retrieve() public view returns (string memory) {
        return storedString;
    }
}