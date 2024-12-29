// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StatusContract {
    mapping(address => string) private userStatus;

    // Events
    event StatusLog(address indexed user, string newStatus);

    // Function to update the user's status
    function updateStatus(string memory _newStatus) public {
        userStatus[msg.sender] = _newStatus;

        emit StatusLog(msg.sender, _newStatus);
    }

    // Function to retrieve the user's current status
    function getStatus() public view returns (string memory) {
        return userStatus[msg.sender];
    }
}
