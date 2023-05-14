import { ethers } from "ethers";
import AbIs from './ContractABI.json';
import  Addresses from './Addresses.json';



const supportChainId = 11155111;

const RPCS = {
   // 56: "https://bsc-dataseed.binance.org/",
   //  97: "https://data-seed-prebsc-1-s1.binance.org:8545",
    // 4002: "https://rpc.testnet.fantom.network",
    // 1337: "http://localhost:7545",
    // 31337: "http://localhost:8545/",
    11155111: "https://rpc.sepolia.org"
};

const providers = {
   // 56: new ethers.providers.JsonRpcProvider(RPCS[supportChainId]),
   // 97: new ethers.providers.JsonRpcProvider(RPCS[supportChainId]),
    // 4002: new ethers.providers.JsonRpcProvider(RPCS[4002]),
    // 1337: new ethers.providers.JsonRpcProvider(RPCS[1337]),
    // 31337: new ethers.providers.JsonRpcProvider(RPCS[31337]),
    11155111: new ethers.providers.JsonRpcProvider(RPCS[supportChainId]),
};

const provider = providers[supportChainId];

const presaleContract = new ethers.Contract(
    Addresses.Presale,
    AbIs.Presale,
    provider
);
const BUSDContract = new ethers.Contract(Addresses.Busd, AbIs.ERC20, provider);

export { presaleContract, BUSDContract, supportChainId, provider };