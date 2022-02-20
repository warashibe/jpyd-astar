// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../JPYD.sol";

contract JPYDMock is JPYD {
    constructor() JPYD() {}

    function getChainId() external view returns (uint256) {
        return block.chainid;
    }
}
