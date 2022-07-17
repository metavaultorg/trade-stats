
export const POLYGON = 137;

export const addresses = {

  [POLYGON]: {
    MVX: "0x2760e46d9bb43dafcbecaad1f64b93207f9f0ed7",
    ES_MVX: "0xd1b2f8dff8437be57430ee98767d512f252ead61",
    MVLP: "0x9f4f8bc00f48663b7c204c96b932c29ccc43a2e8",
    BN_MVX: "0xb6bdd10a12286401c8dfac93fe933c7abbd6d0af",
    STAKED_MVX_TRACKER: "0xe8e2e78d8ca52f238caf69f020fa961f8a7632e9",
    STAKED_MVLP_TRACKER: "0xA6ca41Bbf555074ed4d041c1F4551eF48116D59A",
    BONUS_MVX_TRACKER: "0x295818e13208d81c40e884cc52720c45155fdd93",
    FEE_MVX_TRACKER: "0xaCEC858f6397Dd227dD4ed5bE91A5BB180b8c430",
    FEE_MVLP_TRACKER: "0xaBD6c70C41FdF9261dfF15F4eB589b44a37072eB",
    MATIC: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    BTC: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", // 8 decimals wrapped btc
    ETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // 18 decimals wrapped eth
    LINK: "0xb0897686c545045afc77cf20ec7a532e3120e0f1", // 18 decimals
    UNI: "0xb33eaad8d922b1083446dc23f610c2567fb5180f", // 18 decimals
    AAVE: "0xd6df932a45c0f255f85145f286ea0b292b21c90b", // 18 decimals
    RewardReader: "0x398cab94dea3b44861e7ad7efcd23a6a35d57c3a",
    MvlpManager: "0x13e733ddd6725a8133bec31b2fc5994fa5c26ea9",
    Router: "0xca9c89410025f2bc3befb07ce57529f26ad69093",
    OrderBook: "0x178aec588e98601287ee72d0b55bcb895268ed2c",
    PositionManager: "0xeec142780e5dc844351f00c22df160ff9cf01131",
    FastPriceFeed: "0x44ea6da1cd01899b0f4f17a09cd89eda49eb2b0a",
    PositionRouter: "0x5e51629adcded51a8b51133d4b46d10ec5eb5361",
    PositionExecutorUpKeep: "0x19d27b7ca2163b87792370014fff1e11613d115b"

  },
};

export function getAddress(chainId, key) {
  if (!chainId in addresses) {
    throw new Error(`Unknown chain ${chainId}`);
  }
  if (!(key in addresses[chainId])) {
    throw new Error(`Unknown address key ${key}`);
  }
  return addresses[chainId][key];
}
