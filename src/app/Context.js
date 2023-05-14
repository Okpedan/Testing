import React, {
    createContext,
    useContext,
    useReducer,
    useMemo,
    useEffect,
  } from "react";
  import { ethers } from "ethers";


  
  import {
    presaleContract,
    BUSDContract,
    supportChainId,
    provider,
  } from "./Contract";
  import { toBigNum, fromBigNum } from "./Utils";
  
  const BlockchainContext = createContext();

  const paymentAddress = "0x0917F537C996F2eEF6b0EDbF2188056CB3D7184f";

 
  
  
  
  function reducer(state, { type, payload }) {
    if (type == "increaseCTime") {
      return {
        ...state,
        cTime: state.cTime + 1,
      };
    }
    return {
      ...state,
      [type]: payload,
    };
  }
  
  const INIT_STATE = {
    signer: null,
    price: null,
    BNBPrice: 500,
    totalSold: 0,
    totalAmount: 120000000,
    supportChainId: supportChainId,
    terms: null,
    cTime: 0,
    interval: null,
  };
  
  const BlockchainProvider = ({ children }) => {
  
    const [state, dispatch] = useReducer(reducer, INIT_STATE);
  
    /* ------------ Wallet Section ------------- */
    useEffect(() => {
      getTerm();
      getPrice();
      getTotal();
      updateTotal();
    }, []);
  

  
    const getPrice = async () => {
      try {
        let price = await presaleContract.getPrice();
        let term = await presaleContract.terms();
        dispatch({
          type: "price",
          payload: fromBigNum(price, 6),
        });
  
        dispatch({
          type: "BNBPrice",
          payload: fromBigNum(term.bnbPrice, 6),
        });
      } catch (err) {
        console.log(err);
      }
    };
  
    const updateTotal = () => {
      setInterval(() => {
        getTotal();
      }, 5000);
    };
  
    const getTotal = async () => {
      let bnbBalance = await provider.getBalance(paymentAddress);
      let busdBalance = await BUSDContract.balanceOf(paymentAddress);
      let total =
        fromBigNum(bnbBalance, 18) * state.BNBPrice +
        fromBigNum(busdBalance, 18);
  
      dispatch({
        type: "totalSold",
        payload: total,
      });
    };
  
    const getTerm = async () => {
      let terms = await presaleContract.terms();
  
      let startTime = fromBigNum(terms.startTime, 0);
      let period = fromBigNum(terms.period, 0);
      let roundCount = fromBigNum(terms.roundCount, 0);
  
      dispatch({
        type: "initTerms",
        payload: {
          startTime,
          period,
          roundCount,
        },
      });
  
      setInterval(() => {
        updateTerms({
          startTime,
          period,
          roundCount,
        });
      }, 1000);
    };
  
    const updateTerms = (props) => {
      let nowTime = new Date().valueOf() / 1000;
      let status, duration, roundNum;
      let { startTime, period, roundCount } = props;
      if (nowTime < startTime) {
        duration = startTime - nowTime;
        status = "Presale starts in";
        roundNum = 0;
      } else {
        if (nowTime > startTime + period * roundCount) {
          duration = 0;
          status = "Presale ended";
          roundNum = 11;
        } else {
          roundNum = Math.floor((nowTime - startTime) / period) + 1;
          duration = startTime + roundNum * period - nowTime;
          status = "round ends in";
        }
      }
      dispatch({
        type: "terms",
        payload: {
          duration,
          roundNum,
          status,
        },
      });
    };
  
    /* ------------ Token Buy Section ------------- */
    const BuyToken = async (props) => {
      try {
        const { amount, flag } = props;
  
        const signedPresaleContract = presaleContract.connect(state.signer);
        if (flag === 1) {
          let tx = await signedPresaleContract.buyWithBNB({
            value: toBigNum(amount, 18),
          });
          await tx.wait();
        } else {
          let signedBusdContract = BUSDContract.connect(state.signer);
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
  
    return (
        <>
        
      <BlockchainContext.Provider
        value={useMemo(
          () => [state, { dispatch, BuyToken, getTotal }],
          [state]
        )}
      >
        {children}
      </BlockchainContext.Provider>
      </>
    );
  }
  
  const useBlockchainContext = () => {
    const context = useContext(BlockchainContext);
    if (!context) {
      throw new Error('useBlockchain must be used within a BlockchainProvider');
    }
    return context;
  };
  export { useBlockchainContext, BlockchainProvider };