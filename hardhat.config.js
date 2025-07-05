require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.19" },
      { version: "0.8.28" }
    ]
  },
  networks: {
    sapphireTestnet: {
      url: "https://testnet.sapphire.oasis.dev",
      accounts: [
        "bb98726c343ce3a5a2f3a0c7e919362213ff21cbef5beee319f72af2a062a8b0"
      ]
    }
  }
};
