// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title UserStringStorage
 * @dev Store & retrieve user-specific strings
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract UserStringStorage {

    mapping(address => string) userStrings;

    event StringStored(address indexed user, string str);

    /**
     * @dev Store user-specific string
     * @param str string to store
     */
    function store(string memory str) public {
        userStrings[msg.sender] = str;
        emit StringStored(msg.sender, str);
    }

    /**
     * @dev Retrieve user-specific string
     * @return user-specific string
     */
    function retrieve() public view returns (string memory) {
        return userStrings[msg.sender];
    }
}
