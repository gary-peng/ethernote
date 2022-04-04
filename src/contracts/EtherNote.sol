// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract EtherNote {
    mapping(address => string) private users;
    
    function set(address addr, string memory hash) public {
        users[addr] = hash;
    }
    
    function get(address addr) public view returns (string memory) {
        return users[addr];
    }
}