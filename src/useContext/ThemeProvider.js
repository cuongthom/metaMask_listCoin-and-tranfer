import { notification } from "antd";
import { ethers } from "ethers";
import React, { createContext, useState } from "react";
import {
  SMARTCHAIN_TESTNET_CHAIN_ID,
  SMARTCHAIN_TESTNET_URL,
} from "../Constants";

const ThemeContext = createContext();
function ThemeProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isLogout, setIsLogout] = useState(true);
  const [addressCoin, setAddressCoin] = useState(null);

  const isWeb3Browser = !!window.ethereum;
  const provider = isWeb3Browser
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null;
  const signer = provider ? provider.getSigner() : null;

  const activate = async () => {

    if (!isWeb3Browser || !signer) {
      notification.error({
        message: "Metamask not installed",
        description: "Metamask not installed please install to continue",
        placement: "bottomRight",
      });
      return;
    }
    try {
      // request login to meta mask
      const address = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // switch to bnb test net
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SMARTCHAIN_TESTNET_CHAIN_ID }], // chainId must be in hexadecimal numbers
      });
      // update Account
      setAccount(address);
      setIsLogout(false);
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SMARTCHAIN_TESTNET_CHAIN_ID,
                rpcUrls: [SMARTCHAIN_TESTNET_URL],
                chainName: "Smart Chain - Testnet",
              },
            ],
          });

          // update token
          setIsLogout(false);
          const address = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(address);
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  };


  const index = {
    account,
    setAccount,
    setIsLogout,
    isLogout,
    activate,
    addressCoin,
    setAddressCoin
  };
  return (
    <ThemeContext.Provider value={index}>{children}</ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };
