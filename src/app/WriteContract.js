"use client"
import { useContractWrite, useAccount, usePrepareContractWrite } from 'wagmi'
import PresaleABI from './PresaleABI'
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { toBigNum } from './Utils'
import { useBlockchainContext } from "./Context";

import {
  presaleContract,
  BUSDContract,
  supportChainId,
  provider,
} from "./Contract";

const contractAddress = "0x27163aBde1Da3991eED7190A5A200c0B507c4C55";

export function WriteContract() {

  const [state, { getTotal, }] = useBlockchainContext();

  const [amount, setAmount] = useState(0);
  const [signer, setSigner] = useState(null);
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()



  useEffect(() => {
    const getSigner = async () => {
        if (isConnected) {
            const provider = new ethers.providers.Web3Provider(
                window.ethereum
            );
            const signer = provider.getSigner();
            setSigner(signer);

        }
    };
    getSigner();
}, [isConnected]);



  // const { config } = usePrepareContractWrite({
  //   address: contractAddress,
  //   abi: PresaleABI,
  //   functionName: 'buyWithBusd',
  //   args: [],
  //   overrides: { value: toBigNum(amount, 18) },
  // })
  // const { write, isSuccess, isError, isLoading } = useContractWrite(config)

  const onChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const BuyToken = async (props) => {
    try {
      const { amount, flag } = props;

      const signedPresaleContract = presaleContract.connect(signer);
      if (flag === 1) {
        let tx = await signedPresaleContract.buyWithBNB({
          value: toBigNum(amount, 18),
        });
        await tx.wait();
      } else {
        let signedBusdContract = BUSDContract.connect(signer);
        let tx = await signedBusdContract.approve(
          presaleContract.address,
          toBigNum(amount, 18)
        );
        await tx.wait();

        let tx1 = await signedPresaleContract.buyWithBusd(
          toBigNum(amount, 18)
        );
        await tx1.wait();
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleBuy = () => {

    BuyToken({
      amount: amount,
      flag: 2,
    });
  }


  return (
    <>
    <div>WriteContract</div>
    <div>
     <input type="number" onChange={(e) => onChangeAmount(e)} placeholder="You Pay (BNB)" />
    </div>

{/* <div>
    {isConnected && (
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      write?.()
                    }}>
                      <button disabled={!write || isLoading}>
                        {isLoading ? 'Buying...' : 'Buy'}
                      </button>

                    </form>
                  )}
  </div> */}
      <div>
        
        <button onClick={handleBuy}>Buy Now</button>
    
     </div>


    </>
  )
}
