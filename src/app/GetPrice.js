"use client"
import { useContractRead, useAccount } from 'wagmi'
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import PresaleABI from './PresaleABI'

const contractAddress = "0x27163aBde1Da3991eED7190A5A200c0B507c4C55";

export function GetPrice() {

    const { address, isConnected, isConnecting, isDisconnected } = useAccount()
    const [tokenBalance, setTokenBalance] = useState(0)
     

    const { data } = useContractRead({
        address: contractAddress,
        abi: PresaleABI,
        functionName: 'getPrice',
       // args: ['0xB42B7928bF5383Eb602c3F32D491D5685300eFc2'],
        //overrides: { from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e' },
      })

         function fromBigNum(value, d) {
            return parseFloat(ethers.utils.formatUnits(value, d));
        }

        useEffect(() => {
            if(isConnected && data) {
                setTokenBalance(data)
            } return
        }, [ data])


     return (
       <>
            {
                isConnected && (
                    <div>Current Prize: {(fromBigNum(tokenBalance, 6))} {" "} Usd</div>
                )
                
            }
            {
                !isConnected && (
                  <div>Current Prize: {(fromBigNum(tokenBalance, 6))} {" "} Usd</div>
                )
            }
         

        </>
       )
             
        
    
    
   
}
