import mintingDapp from "./abi2.json";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3("https://eth-mainnet.g.alchemy.com/v2/Q2WADcmWSaZ7nEJbyQFXGE9bGhU_N3-1");

    const contractAddress = "0x715978e9c4E45967304A367fE24426Ea1A5c0403";
const contract = new web3.eth.Contract(mintingDapp, contractAddress)

export const getSaleState = async () => {
    const result = await contract.methods.publicSale().call();
    return result;
  };

export const getFreeSaleState = async () => {
    const result = await contract.methods.freeSale().call();
    return result;
  };

  

export const getTotalSupply = async () => {
  const result = await contract.methods.totalSupply().call();
  return result;
};
