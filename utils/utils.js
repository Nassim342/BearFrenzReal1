import mintingDapp from "./abi2.json";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3("https://eth-goerli.g.alchemy.com/v2/KM-fdOe3U52el4ZvdrmEdjuzxE-Z8V5X");

const contractAddress = "0x5f9078d95b30ea815f03b76AA0E06b900AfD4b64";
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