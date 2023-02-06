import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { AiOutlineCustomerService, AiOutlineCalendar } from "react-icons/ai";
import { ThemeContext } from "../useContext/ThemeProvider";
import { ERC20_interface_ABI } from "../Constants";
import { Link } from "react-router-dom";

const tokens = [
  {
    name: "USDT",
    balance: 0,
    address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    URL: "../../Img/Tether-USDT-icon.png",
  },
  {
    name: "BTCB",
    balance: 0,
    address: "0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8",
    URL: "../../Img/bitcoin.png",
  },
  {
    name: "BingSu",
    balance: 0,
    address: "0x0f0a9CEEe3517D1aa90A78c82FD65d73357E664E",
    URL: "../../Img/photo_2022-11-24_15-50-53.jpg",
  },
  {
    name: "Fireal",
    balance: 0,
    address: "0x82216F56f2d369e37B1e62d0e8832DEa91ef4575",
    URL: "../../Img/Fireal.jpg",
  },
  {
    name: "DAI",
    balance: 0,
    address: "0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867",
    URL: "../../Img/4943.png",
  },
  {
    name: "USDC",
    balance: 0,
    address: "0x64544969ed7EBf5f083679233325356EbE738930",
    URL: "../../Img/usd-coin-usdc-logo.png",
  },
  {
    name: "BUSD",
    balance: 0,
    address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    URL: "../../Img/62da512ff192d82df80012bb.png",
  },
];
function HomePage() {
  
  const [balanceTBNB, setBalanceTbnb] = useState(null);
  const [listToken, setListToken] = useState(tokens);
  // console.log("cuongcuong", listToken);
  const context = useContext(ThemeContext);
  console.log("is log out", context.isLogout);
  console.log("ccccc",listToken.balance);
  //Ham chuyen chain
  const handleChainChanged = () => {
    context.setAccount(null);
    setListToken(tokens);
  };

  //ham chuyen acount
  const handleAccountChanged = (accounts) => {
    // console.log(accounts);
    context.setAccount(null);
    setListToken(tokens);
  };


  async function logoutMetamask() {
    context.setAccount(null);
    setListToken(tokens);
  }

  useEffect(() => {
    console.log("call use effect");
    window.ethereum.on("accountsChanged", handleAccountChanged);

    window.ethereum.on("chainChanged", handleChainChanged);
  }, []);

  const handleGetTokenBalance = async (tokenAddress) => {
    const isWeb3Browser = !!window.ethereum;
    const provider = isWeb3Browser
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null;
    const Contract = new ethers.Contract(
      tokenAddress,
      ERC20_interface_ABI,
      provider
    );
    if (context.account !== null) {
      const Balance = await Contract.balanceOf(context.account[0]);
      const balanceNumber = ethers.utils.formatEther(Balance);
      return balanceNumber;
    }

    // console.log("cuongthommmm",Balance);
  };

  const handleGetBnbBalance = async () => {
    const isWeb3Browser = !!window.ethereum;
    const provider = isWeb3Browser
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null;
    const signer = provider ? provider.getSigner() : null;
    if (!signer) {
      return;
    }
    const BnbBalance = await signer.getBalance(); // BnbBalance ở đây sẽ bằng con số x10 mũ 18
    const balanceNumberBNB = ethers.utils.formatEther(BnbBalance); //biến này sẽ format con số 10^18 ra con số chuẩn
    setBalanceTbnb(balanceNumberBNB);
    context.setAddressCoin(tokens[0].address)
  };

  const getTokenBalance = async () => {
    const updateTokens = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const balance = await handleGetTokenBalance(token.address);

      //   updateTokens.push({
      //     name: token.name ,
      //     address: token.address,
      //     balance: balance,
      // })
      
      console.log("cuongthommmm", { ...token, balance });
      updateTokens.push({ ...token, balance });
    }
    setListToken(updateTokens);
    coinToUsd(updateTokens)
  };

  useEffect(() => {
    getTokenBalance();
    handleGetBnbBalance();
  }, [context.account]);

  const handleTransfer = (address) => {
    context.setAddressCoin(address);
    console.log("address",address);
  };
  const coinToUsd = (cuong) => {
    let mangSos = []
    let sum = 0
    for(let i = 0 ; i< cuong.length ; i++) {
      
      const trung = cuong[i]
      // console.log(a);
      if(trung.name === "DAI" || trung.name === "BUSD" || trung.name === "USDC" || trung.name === "USDT") {
        const sos = trung.balance * 1
        mangSos.push({sos})
      }

      // console.log("cuoncuong",mangSos);
      // if(trung.name === "BTCB") {
      //   const sos = trung.balance * 16.917
        
      // }
      // console.log("cuongccc",d);
      
    }
console.log("cacacac",sum);

  }
  return (
    <div className="flex bg-color  ">
      <div className="bg-neutral-300 text-white w-52 z-10">
        <div className="d-flex align-items-start flex-column h-screen ">
          <div className="mb-auto p-2 bd-highlight my-20 text-black">
            <div className="flex text-xl ">
              <AiOutlineCalendar />
              <p className="px-2 ">Portfolio</p>
            </div>
            <div className="flex text-xl">
              <AiOutlineCustomerService />
              <p className="px-2">Bridge</p>
            </div>
            <div className="flex text-xl">
              <AiOutlineCustomerService />
              <p className="px-2">Watchlist</p>
            </div>
            <div className="flex text-xl">
              <AiOutlineCustomerService />
              <p className="px-2">Settings</p>
            </div>
          </div>
          <div className="p-2 text-black">
            <div className="flex text-xl">
              <AiOutlineCustomerService />
              <p className="px-2">FAQ</p>
            </div>
            <div className="flex text-xl">
              <AiOutlineCustomerService />
              <p className="px-2">Contact</p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="z-0 absolute ml-28 ml-0 h-full px-60">
        <img
          className=" w-full h-screen"
          src="../../Img/bitcoin.jpg"
          alt="ădasd"
        />
      </div> */}
      <div className="bd-highlight w-full px-10 z-10 ">
        <div className="flex py-4 ">
          <div className="p-2 flex-grow-1 bd-highlight flex text-2xl ">
            <h2 className="text-4xl text-black ">Portfolio</h2>
          </div>
          <div className="p-2 bd-highlight flex my-2">
            {context.account ? (
              <>
                <Link to={`/Transfers/${tokens[0].address}`}>
                  <div className="text-black bg-blue-500 pt-0.5 px-2 w-24 h-8 text-center rounded-xl mx-2">
                    <button className=" w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      Transfers
                    </button>
                  </div>
                </Link>
              </>
            ) : null}

            <div className="pt-0.5 px-2 w-24 h-8 bg-lime-500 text-center rounded-xl ">
              <button
                className=" w-full overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={context.account ? logoutMetamask : context.activate}
              >
                {context.account || "sign in"}
              </button>
            </div>
          </div>
        </div>
        <div className="px-2 py-4">
          <h2>Net Worth</h2>
          <p className="text-3xl">$00.00</p>
        </div>
        <div className="bg-neutral-300 opacity-90 rounded-lg mb-10">
          <div className="mb-auto p-2 bd-highlight">
            <p className="text-4xl font-medium">Assets</p>
          </div>

          <div className="d-flex justify-content-around">
            <p className="text-black	text-xl font-normal">Token</p>
            <p className="text-black	text-xl font-normal">Portfolio %</p>
            <p className="text-black	text-xl font-normal">Price</p>
            <p className="text-black	text-xl font-normal">Balance</p>
          </div>
          <hr className="mx-4 my-6" />
          <div className="text-start">
            {context.account ? (
              <div className="text-xl">
                <div className="container text-center">
                  <div className="row">
                    <div className="col order-first flex pl-20">
                      <img
                        className="w-10 py-2"
                        src="../../Img/Layer 2.png"
                        alt=""
                      />
                      <p className="my-0 py-2 px-2 my-2">TBNB</p>
                    </div>
                    <div className="col order-last">$xxxxxx</div>
                    <div className="col order-last">$xxxxxxxx</div>
                    <div className="col order-last">
                      <p>{balanceTBNB}</p>
                    </div>
                  </div>
                </div>
                { listToken.map((token) => (
                  
                  <div key={token.address} className="container text-center">
                    <div className="row flex">
                      <Link
                        className="text-black flex hover:text-black"
                        to={`/Transfers/${token.address}`}
                      >
                        <div
                          onClick={() => handleTransfer(token.address)}
                          className="col order-first flex pl-20"
                        >
                          <img className="w-10 py-2" src={token.URL} alt="" />
                          <p className="my-0 py-2 px-2 my-2">{token.name}</p>
                        </div>

                        <div className="col order-last" >$xxxxxx</div>
                        <div className="col order-last" >$xxxxxxxx</div>
                        <div className="col order-last" >
                          <p>{token.balance}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
