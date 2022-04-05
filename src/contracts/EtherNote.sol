// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract EtherNote {
    mapping(address => string) private users;
    
    function set(string memory hash) public {
        address addr = msg.sender;

        users[addr] = hash;
    }
    
    function get() public view returns (string memory) {
        address addr = msg.sender;

        if ((bytes(users[addr]).length) == 0) {
            return "User not found";
        }
        return users[addr];
    }
}