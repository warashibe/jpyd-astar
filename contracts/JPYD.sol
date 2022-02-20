// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JPYD is ERC20Permit, Ownable {
  constructor() ERC20PresetMinterPauser("JPY Dog", "JPYD") ERC20Permit("JPY Dog") {}
}
