// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const BreakAnalyzer = await ethers.getContractFactory("BreakAnalyzer");
  const contract = await BreakAnalyzer.deploy();

  await contract.waitForDeployment();

  console.log("✅ BreakAnalyzer deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

