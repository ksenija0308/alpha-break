// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BreakAnalyzer {
    function shouldPromptBreak(uint idleSeconds, uint typingSpeed) public pure returns (bool) {
        if (idleSeconds > 300 || typingSpeed < 40) {
            return true;
        } else {
            return false;
        }
    }
}
