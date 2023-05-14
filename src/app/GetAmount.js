"use client"
import { ethers } from "ethers";
import { useEffect, useState, useRef } from 'react';
import { useBlockchainContext } from "./Context";


export  function GetAmount() {

    const [state, { getTotal }] = useBlockchainContext();
    const [bnbAmount, setBNBAmount] = useState(0);
    const [busdAmount, setBUSDAmount] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [percent, setPercent] = useState(0);
    const [totalUSDT, setTotalUSDT] = useState(0);
    const totalSoldRef = useRef(0);


    useEffect(() => {
         totalSoldRef.current += state.totalSold
        setTotalUSDT(totalSoldRef.current)
    }, [state.totalSold])

    // To get token Amount when BNB is choosen
    useEffect(() => {
        if (bnbAmount > 0) {
                 setTokenAmount((bnbAmount * state.BNBPrice) / state.price)       
        } else {
            setTokenAmount(0);
        }
    }, [bnbAmount]);
   

    // To get token Amount when BUSD is choosen
    useEffect(() => {
        if (busdAmount > 0) { 
                 setTokenAmount(busdAmount / state.price);
        } else {
            setTokenAmount(0);
        }
    }, [busdAmount]);

    
    const onChangeBNBAmount = (e) => {
        setBNBAmount(e.target.value);
    };

    const onChangeBUSDAmount = (e) => {
        setBUSDAmount(e.target.value);
    };

   // To set percent of total sold
    useEffect(() => {
        if (state.totalSold !== null) {
            setPercent(
                Number((state.totalSold / state.totalAmount) * 100).toFixed(2)
            );
        } else {
            setPercent(0);
        }
    }, [state.totalSold]);
    

  return (
    <>
         <div>
             <span>Price: {state.price}</span>
         </div>
    
        <div>
             <span>USDT Raised: ({Number(totalUSDT).toFixed(2)} $)</span>                          
        </div>

        <div>
             <div style={{ width: `${percent}%` }}> </div>
        </div>

        <label>Enter Amount</label>
        <div>
            <input type="number" onChange={(e) => onChangeBNBAmount(e)} />
        </div>

        <div>
            <input type="number" onChange={(e) => onChangeBUSDAmount(e)} />
        </div>

        <div>
        <label>Token Amount: </label>
                 <span className="color">
                    {state.price === null || state.BNBPrice === null ? "updating..." : tokenAmount}
                </span>
        </div>
        
    </>
  )
}
