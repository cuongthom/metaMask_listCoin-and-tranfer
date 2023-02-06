import React, { useContext, useState } from "react";
import { ethers } from "ethers";
import { ERC20_interface_ABI } from "../Constants";
import { ThemeContext } from "../useContext/ThemeProvider";
import { message } from "antd";
import { Button, Space } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
function Transfers() {
 

  const context = useContext(ThemeContext);

  const submitTranfers = async (e) => {
    e.preventDefault();
    try {
      if (!typeof window.ethereum !== "undefined") {
        context.activate();
        const data = new FormData(e.target);
        const isWeb3Browser = !!window.ethereum;
        const provider = isWeb3Browser
          ? new ethers.providers.Web3Provider(window.ethereum)
          : null;
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          context.addressCoin,
          ERC20_interface_ABI,
          signer
        );
        
        const amount = data.get("amount");
        const amountBigNumber = ethers.utils.parseEther(amount); //lấy ra mã hex quy về số nhỏ hơn 10^18
        console.log("cuongthom", amountBigNumber);
        const Transfers = await contract.transfer(
          data.get("recipient"),
          amountBigNumber
        );

        await Transfers.wait();
        message.success("successful deposit")
      }
    } catch {
      
      message.error("MetaMask : User denied transaction signature.")
    }
  };
  return (
    <div>
      
      <h1 className="text-center text-3xl">Transfers</h1>
      <h2 className="text-center">{context.account}</h2>
      {/* <h3 className="text-center">{context.addressCoin}</h3> */}
      {context.account ? (
        <form onSubmit={submitTranfers}>
          <div className="mb-3">
            {/* <label className="form-label"></label> */}
            <input
              placeholder="recipient (address)"
              name="recipient"
              type="text"
              className="form-control w-3/6 mx-2 "
            />
          </div>
          <div className="mb-3 ">
            {/* <label className="form-label"></label> */}
            <input
              placeholder="amount (uint256)"
              name="amount"
              type="text"
              className="form-control w-3/6 mx-2 "
            />
          </div>
          <div className="text-xl form-label">
            <button>submit</button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default Transfers;
