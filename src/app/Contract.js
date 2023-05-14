import { ethers } from "ethers";
import ABI from './PresaleABI';
import BusdABI from './BusdABI';


const PresaleAddress = "0x27163aBde1Da3991eED7190A5A200c0B507c4C55";
const BUSDAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";

const supportChainId = 97;

const RPCS = {
   // 56: "https://bsc-dataseed.binance.org/",
     97: "https://data-seed-prebsc-1-s1.binance.org:8545",
    // 4002: "https://rpc.testnet.fantom.network",
    // 1337: "http://localhost:7545",
    // 31337: "http://localhost:8545/",
};

const providers = {
   // 56: new ethers.providers.JsonRpcProvider(RPCS[supportChainId]),
    97: new ethers.providers.JsonRpcProvider(RPCS[supportChainId]),
    // 4002: new ethers.providers.JsonRpcProvider(RPCS[4002]),
    // 1337: new ethers.providers.JsonRpcProvider(RPCS[1337]),
    // 31337: new ethers.providers.JsonRpcProvider(RPCS[31337]),
};

const provider = providers[supportChainId];

const presaleContract = new ethers.Contract(
    PresaleAddress,
    ABI,
    provider
);
const BUSDContract = new ethers.Contract(BUSDAddress, BusdABI, provider);

export { presaleContract, BUSDContract, supportChainId, provider };