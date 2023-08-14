// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title CustomStringStorage
 * @dev Store & retrieve customized strings
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract CustomStringStorage {

    mapping(string => string) customizedStrings;

    event StringStored(string key1, string value1);

    /**
     * @dev Store customized string
     * @param key unique key for the string
     * @param value string to store
     */
    function store(string memory key, string memory value) public {
        customizedStrings[key] = value;
        emit StringStored(key, value);
    }

    /**
     * @dev Retrieve customized string
     * @param key unique key for the string
     * @return customized string
     */
    function retrieve(string memory key) public view returns (string memory) {
        return customizedStrings[key];
    }
}
