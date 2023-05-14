"use client"
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { BlockchainProvider } from "./Context";
import { ConnectKitProvider } from "connectkit";
//import { Connection } from "./connection";
import { ConnectButton } from "./ConnectButton";
import { mainnet, polygon, bsc, bscTestnet } from "wagmi/chains";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';
//import { GetPrice } from "./GetPrice";
import { GetTokenBalance } from "./GetTokenBalance";
import { GetAmount } from "./GetAmount";
import { WriteContract } from "./WriteContract";



import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const alchemyId = process.env.ALCHEMY_ID;
const infuraId = process.env.INFURA_ID;

// const BNBChain = {
//     id: 56,
//     name: "Binance",
//     nativeCurrency: {
//       decimals: 18,
//       name: "BNB",
//       symbol: "BNB",
//     },
//     rpcUrls: {
//         public: { http: ['https://bsc-dataseed.binance.org'] },
//         default: { http: ['https://bsc-dataseed.binance.org'] },
//       },
//     blockExplorers: {
//       default: { name: "Bscscan", url: "https://bscscan.com" },
//       bscscan: { name: "Bscscan", url: "https://bscscan.com" },
//     },
//     testnet: false,
//     contracts: {
//         multicall3: {
//           address: '0xca11bde05977b3631167028862be2a173976ca11',
//           blockCreated: 11_907_934,
//         },
//       },
//   };


//   const BNBTestnetChain = {
//     id: 97,
//     name: "Binance",
//     nativeCurrency: {
//       decimals: 18,
//       name: "tBNB",
//       symbol: "tBNB",
//     },
//     rpcUrls: {
//       default: "https://data-seed-prebsc-1-s1.binance.org:8545",
//     },
//     blockExplorers: {
//       default: { name: "Bscscan Testnet", url: "https://testnet.bscscan.com" },
//       bscTestnet: { name: "Bscscan Testnet", url: "https://testnet.bscscan.com" },
//     },
//     testnet: true,
//   };

const { chains, provider, webSocketProvider, } = configureChains(
  [mainnet, bsc, bscTestnet],
    [
        alchemyProvider({ apiKey: alchemyId }),
        infuraProvider({ apiKey: infuraId }),
        publicProvider(),
        jsonRpcProvider({
            rpc: (chain) => ({
                http: `https://bsc.getblock.io/d2cd506a-5e0c-44f9-9941-627fb796156c/mainnet`,
                webSocket: `wss://bsc.getblock.io/d2cd506a-5e0c-44f9-9941-627fb796156c/mainnet`,
              }),
          }),
          jsonRpcProvider({
            rpc: (chain) => ({
                http: `https://bsc.getblock.io/d2cd506a-5e0c-44f9-9941-627fb796156c/testnet`,
                webSocket: `wss://bsc.getblock.io/d2cd506a-5e0c-44f9-9941-627fb796156c/testnet`,
              }),
          }),
    ],
   
)


const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),

        new CoinbaseWalletConnector({
            chains,
            options: {
              appName: 'Daniel Project',
            },
          }),

          new WalletConnectConnector({
            chains,
            options: {
                qrcode: false,
                projectId: '233a99fd7bbca895ce8208ded2fe0c13',
            },
          }),
    ],
    provider,
    webSocketProvider,
});

 
  export function Bridge() {
    return (
       
           <WagmiConfig client={client}>
               <ConnectKitProvider customTheme={{
                   "--ck-connectbutton-hover-color": "rgba(255, 0, 0, 0.8)",
                   }}
                       options={{
                       walletConnectName: "WalletConnect",
                       disclaimer: (
                       "Make Sure to Switch to your Desired Network"
                         ),
                      overlayBlur: 50,
                      initialChainId: 97,
                      hideBalance: false,
                  }}
                    >


<BlockchainProvider>

                         <main>
                             <ConnectButton />
                            {/* <Connection />
                            <GetPrice />*/}
                            <GetTokenBalance />   
                            <GetAmount />
                            <WriteContract />
                         </main>
                         </BlockchainProvider>

                 </ConnectKitProvider>
             </WagmiConfig>
      
    )
  }