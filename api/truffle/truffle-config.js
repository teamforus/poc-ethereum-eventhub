module.exports = {
  networks: {
    development: {
      //host: "81.169.218.221",
      //port: 9001,
      host: "localhost",
      port: 8545,
      //from: "0xb8918494b24862b2b9dc7cc2c3e9a41893d8d4b6", // Geth client
      from: "0x174c9b9ff0d93737132eb194430b56dc5ff5f3b2", // Cheesy testrp
      //host: "136.144.185.48",
      
      network_id: "development",
      chainId: 1492,
      //network_id: 4385,
      //from: "0x7b2afe6d5e16944084eaa292ecaa9c3b6469b445",
      gas: 3169294
    }
  }
};
