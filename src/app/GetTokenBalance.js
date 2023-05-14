"use client"
import { useContractRead, useAccount } from 'wagmi'
import PresaleABI from './PresaleABI'
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

const contractAddress = "0x27163aBde1Da3991eED7190A5A200c0B507c4C55";

export function GetTokenBalance() {

    const { address, isConnected, isConnecting, isDisconnected } = useAccount()
    const [tokenBalance, setTokenBalance] = useState(0)

    
     

    const { data } = useContractRead({
        address: contractAddress,
        abi: PresaleABI,
        functionName: 'getTokenClaimBalance',
        args: [address],
        //overrides: { from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e' },
      })

         function fromBigNum(value, d) {
            return parseFloat(ethers.utils.formatUnits(value, d));
        }

        useEffect(() => {
            if(isConnected && data) {
                setTokenBalance(data)
            } return
        }, [isConnected, data])


     return (
       <>
            {
                isConnected && (
                    <div>You have: {(fromBigNum(tokenBalance, 18))} Dantokens </div>
                )
                
            }
            {
                !isConnected && (
                    <div> </div>
                )
            }

        </>
       )
             
        
    
    
   
}
