import React, { useState, useEffect, useContext } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  connectors,
  connectorLocalStorageKey,
  getConnector,
} from "./utils/connectors";
import { setupNetwork } from "./utils/wallet";
import { useInactiveListener } from "./hooks/useInactiveListener";
import { useAxios } from "./hooks/useAxios";
import { getErrorMessage, getErrorType } from "./utils/ethereum";
import {
  getUser,
  loginUser,
  useAuthDispatch,
  useAuthState,
  logout,
} from "./context/authContext";
import "./components/styles/CustomCss/style.css";
import "./components/styles/CustomCss/Responsive.css";
import "./components/styles/CustomCss/Darkstyle.css";
import FooterMobile from "./components/pages/FooterMobile/Footer";
import { device } from "./components/devices";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import Identicon from "@polkadot/react-identicon";
import TopNav from "./components/UI_components/TopNav";
import { Navbar } from "./components/UI_components/Navbar";
import { MarketPlace } from "./components/pages/MarketPlace/MarketPlace";
import styled from "styled-components";
import MyRoutes from "./routes";
import { shorter } from "./utils";
import {
  ModalWindow,
  ModalContainer,
  ModalWrap,
  ModalBody,
  ModalFooter,
} from "./components/styles/Common";
import { ThemeProvider, useTheme, test } from "./context/themeContext";
import { ethers } from "ethers";
import { getContract } from "./utils/contract"




// Define styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainConetent = styled.div`
  display: flex;
  justify-content: space-between;
  .desk-markt {
    position: relative;
  }
  @media ${device.laptopS} {
    width: 100%;
    justify-content: space-between;
    .desk-markt {
      display: none;
    }
  }
  @media ${device.laptopL} {
    .desk-markt {
      width: 37%;
      position: relative;
    }
  }
  @media ${device.tablet} {
    display: flex;
    width: 100%;
    .desk-markt {
      display: none;
    }
  }
  @media ${device.mobile} {
    display: block;
    .desk-markt {
      display: none;
    }
  }
`;

const WModalBody = styled(ModalBody)`
  text-align: center;
  & > img {
    height: 70px;
  }
  & > .success-title {
    padding-bottom: 20px;
  }
  & > .wallet-list {
    max-height: 400px;
    overflow-y: auto;
  }
`;

const WModalWalletButton = styled.button`
  background: linear-gradient(180deg, #00beee 0%, #0087d1 100%);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25),
    inset 2px 2px 14px rgba(255, 255, 255, 0.25);
  border-radius: 5px;
  border: none;
  font-weight: 900;
  font-size: 18px;
  text-align: center;
  letter-spacing: 0.15em;
  color: #ffffff;
  cursor: pointer;
  margin: 2% 0;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  & > svg {
    margin-left: 10px;
  }
`;

const MintNftForm = styled.div` 
.form-title { font-size: 24px; font-weight: bold; } 
.form-label { display: block; margin-bottom: 8px; } 
.form-input { width: 100%; padding: 8px; margin-bottom: 16px; border: 1px solid #ccc; border-radius: 4px; } 
.form-button { padding: 10px 20px; background-color: #00beee; border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 16px; } 
`;

const WModalCloseButton = styled.button`
  background: #00beee;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 2px 2px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WModalFooter = styled(ModalFooter)`
  padding-top: 24px;
  & > button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: unset;
    width: 100%;
    & > img {
      height: 32px;
      margin-right: 10px;
    }
  }
`;
function App() {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [errorType, setErrorType] = useState("unknown");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false); 
  const [mintingSuccess, setMintingSuccess] = useState(false); 
  const [mintingError, setMintingError] = useState(null);

  const { account, library, activate, active, connector, deactivate, chainId } = useWeb3React();

  useEffect(() => { 
     if (chainId !== 11155111) { 
       alert("Please switch to the Sepolia Testnet"); 
      } }, [chainId]);

  useAxios();

  

  const connectAccount = () => {
    console.log("come here");
    setConnectModalOpen(true);
  };

  const mintNFT = async (title, uri) => {
    try {
      console.log(`Minting NFT: ${title}`); // Log the title for reference
      const contract = getContract(library); // Get the contract instance
      const transaction = await contract.mintTo(account, uri); 
      await transaction.wait(1);
      setMintingSuccess(true);
      setMintingError(null);
    } catch (error) {
      setMintingSuccess(false);
      setMintingError(error.message);
    }
  };
  


  const connectToProvider = (connector) => {
    let _tried = false;
    let _triedError = undefined;
    const connectorKey = window.localStorage.getItem(connectorLocalStorageKey);
    if (connectorKey && connectorKey !== "") {
      const currentConnector = getConnector(connectorKey);
      if (connectorKey === "injectedConnector") {
        currentConnector.isAuthorized().then((isAuthorized) => {
          if (isAuthorized) {
            activate(currentConnector, undefined, true).catch((error) => {
              if (error instanceof UnsupportedChainIdError) {
                setupNetwork().then((hasSetup) => {
                  if (hasSetup) activate(currentConnector);
                });
              }
              _triedError = error;
              _tried = true;
            });
          } else _tried = true;
        });
      } else {
        activate(currentConnector);
        _tried = true;
      }
    }
    if (_tried) {
      const errorMsg = getErrorMessage(_triedError);
      const errType = getErrorType(_triedError);
      setNetworkError(errorMsg);
      setErrorType(errType);
      setErrorModalOpen(true);
    }
    activate(connector);
  };

  // Handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    const connectorKey = window.localStorage.getItem(connectorLocalStorageKey);
    if (connectorKey && connectorKey !== "") {
      const currentConnector = getConnector(connectorKey);
      if (connectorKey === "injectedConnector") {
        currentConnector.isAuthorized().then((isAuthorized) => {
          if (isAuthorized) activate(currentConnector);
        });
      } else {
        activate(currentConnector);
      }
    } else if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activate, activatingConnector, connector]);

  const { activateError } = useInactiveListener(!!activatingConnector);

  // Handling connection error
  if (activateError && errorModalOpen === null) {
    const errorMsg = getErrorMessage(activateError);
    const errType = getErrorType(activateError);
    setNetworkError(errorMsg);
    setErrorType(errType);
    setErrorModalOpen(true);
  }

  const handleLogout = async () => {
    deactivate();
    window.localStorage.removeItem(connectorLocalStorageKey);
    setLogoutModalOpen(false);
  };

  const openLogoutModal = () => {
    setLogoutModalOpen(true);
  };

  const closeErrorModal = () => {
    window.localStorage.setItem(connectorLocalStorageKey, connectors[0].key);
    setErrorModalOpen(false);
  };

  // Kusama connect
  const [kuConnect, setKuConnect] = useState(false);
  const [kuAccounts, setKuAccounts] = useState([]);
  const [kuWallet, setKuWallet] = useState(null);
  const [isKuOpen, setIsKuOpen] = useState(false);
  const [isKuError, setIsKuError] = useState(false);
  const extensionKuSetup = async (initialization = false) => {
    const extensions = await web3Enable("polkadot-kuverse-app");
    if (extensions.length === 0) {
      localStorage.setItem("kuverse_ku_wallet", null);
      if (!initialization) setIsKuError(true);
      return;
    }
    let isPolkadot = false;
    for (let i = 0; i < extensions.length; i++) {
      if (extensions[i].name === "polkadot-js") {
        const accounts = await web3Accounts();
        const polkadotAccounts = accounts.filter(
          (account) => account.meta.source === "polkadot-js"
        );
        setKuAccounts(polkadotAccounts);
        setKuConnect(true);
        isPolkadot = true;
      }
    }
    if (!isPolkadot) {
      localStorage.setItem("kuverse_ku_wallet", null);
      if (!initialization) setIsKuError(true);
    }
  };

  useEffect(() => {
    extensionKuSetup(true);
    saveKuwallet(null);
  }, []);

  const connectKusama = async () => {
    if (!kuConnect) await extensionKuSetup();
    else setIsKuOpen(true);
  };

  const saveKuwallet = (_kuWallet) => {
    if (_kuWallet) {
      setKuWallet(_kuWallet);
      localStorage.setItem("kuverse_ku_wallet", JSON.stringify(_kuWallet));
    } else {
      let localWallet = localStorage.getItem("kuverse_ku_wallet");
      if (localWallet) setKuWallet(JSON.parse(localWallet));
    }
    setIsKuOpen(false);
  };

    // Kilt wallet setup
    const [kiltConnect, setKiltConnect] = useState(false);
    const [kiltAccounts, setKiltAccounts] = useState([]);
    const [kiltWallet, setKiltWallet] = useState(null);
    const [isKiltOpen, setIsKiltOpen] = useState(false);
    const [isKiltError, setIsKiltError] = useState(false);
    const dispatch = useAuthDispatch();
    const { user, token } = useAuthState();
  
    const loginWithKilt = async () => {
      if (!kiltConnect || !kiltWallet) return;
      if (!!user) {
        await getUser(dispatch, kiltWallet.address);
      }
      loginUser(dispatch, kiltWallet.address);
    };
  
    const logoutWithKilt = async () => {
      logout(dispatch);
    };
  
    useEffect(() => {
      loginWithKilt();
    }, [kiltWallet, kiltConnect]);
  
    const extensionKiltSetup = async (initialization = false) => {
      const extensions = await web3Enable("sporran-kuverse-app");
      if (extensions.length === 0) {
        localStorage.setItem("kuverse_kilt_wallet", null);
        if (!initialization) setIsKiltError(true);
        return;
      }
      let isSporran = false;
      for (let i = 0; i < extensions.length; i++) {
        if (extensions[i].name === "Sporran") {
          setKiltConnect(true);
          isSporran = true;
          const accounts = await web3Accounts();
          const sporranAccounts = accounts.filter(
            (account) => account.meta.source === "Sporran"
          );
          setKiltAccounts(sporranAccounts);
        }
      }
      if (!isSporran) {
        localStorage.setItem("kuverse_kilt_wallet", null);
        if (!initialization) setIsKiltError(true);
      }
    };
  
    useEffect(() => {
      extensionKiltSetup(true);
      saveKiltWallet(null);
    }, []);
  
    const connectSporran = async () => {
      if (!kiltConnect) await extensionKiltSetup();
      else setIsKiltOpen(true);
    };
  
    const saveKiltWallet = async (_kiltWallet) => {
      if (_kiltWallet) {
        setKiltWallet(_kiltWallet);
        localStorage.setItem("kuverse_kilt_wallet", JSON.stringify(_kiltWallet));
        // If additional Kilt logic is required, it can be included here
      } else {
        let localWallet = localStorage.getItem("kuverse_kilt_wallet");
        if (localWallet) setKiltWallet(JSON.parse(localWallet));
      }
      setIsKiltOpen(false);
    };

    return (
      <ThemeProvider>
        <AppContainer>
          <>
            <TopNav />
            <MainConetent>
              <Navbar
                connectAccount={connectAccount}
                connectKusama={connectKusama}
                kuWallet={kuWallet}
                openLogoutModal={openLogoutModal}
              />
              <div className="r-l-border responsive">
                <MyRoutes
                  connectAccount={connectAccount}
                  getUser={getUser}
                  user={user}
                  loginWithKilt={loginWithKilt}
                  logoutWithKilt={logoutWithKilt}
                  connectKusama={connectKusama}
                  kuWallet={kuWallet}
                  setIsKuError={setIsKuError}
                  connectSporran={connectSporran}
                  kiltWallet={kiltWallet}
                  setIsKiltError={setIsKiltError}
                />
              </div>
              <MintNftForm> 
                <h3 className="form-title">Mint Your NFT</h3> 
                <form
                onSubmit={async (e) => {
                e.preventDefault();
                const title = e.target.title.value;
                const uri = e.target.uri.value;
               await mintNFT(title, uri); // Pass title and uri to mint function
               }}
               >
                 <label className="form-label">
                     Title:
                    <input type="text" name="title" required className="form-input" />
                     </label>
                        <label className="form-label">
                        URI:
                       <input type="text" name="uri" required className="form-input" />
                      </label>
                      <button type="submit" className="form-button">Mint NFT</button>
                     </form>

                      {mintingSuccess && <p>Minting successful!</p>} 
                      {mintingError && <p>Error: {mintingError}</p>} 
                      </MintNftForm> {device.mobile && ( <div className="desk-markt"> 
                        <MarketPlace /> 
                        </div> )} 
                        </MainConetent>
            <FooterMobile />
          </>
          {!!errorModalOpen && !active && (
            <ModalWindow className="modal-window">
              <ModalContainer>
                <ModalWrap className="modal-wrap" style={{ paddingBottom: 24 }}>
                  <ModalBody>
                    <h3 className="success-title">Connect your wallet</h3>
                    {errorType === "chain" && (
                      <h5 className="success-subtitle">Wrong Network</h5>
                    )}
                    <h5 className="success-subtitle">
                      {errorType === "chain"
                        ? "Please switch your network to Exosama"
                        : networkError}
                    </h5>
                  </ModalBody>
                  <WModalFooter>
                    {errorType === "chain" ? (
                      <button
                        onClick={() => {
                          setErrorModalOpen(false);
                          connectAccount();
                        }}
                        style={{ letterSpacing: 0 }}
                      >
                        <img src="/assets/bird-white.svg" alt="" />
                        Switch to Exosama Network
                      </button>
                    ) : (
                      <button onClick={() => setErrorModalOpen(false)}>
                        <img src="/assets/bird-white.svg" alt="" />
                        CLOSE
                      </button>
                    )}
                  </WModalFooter>
                </ModalWrap>
              </ModalContainer>
            </ModalWindow>
          )}
              
      {/* Kilt Wallet Modal */}
      {!!isKiltError && (
        <ModalWindow className="modal-window">
          <ModalContainer>
            <ModalWrap className="modal-wrap" style={{ paddingBottom: 24 }}>
              <ModalBody>
                <h3 className="success-title">Connect your wallet</h3>
                <h5 className="success-subtitle">
                  Please check your Sporran extension connection
                </h5>
              </ModalBody>
              <WModalFooter>
                <button onClick={() => setIsKiltError(false)}>
                  <img src="/assets/bird-white.svg" alt="" />
                  CLOSE
                </button>
              </WModalFooter>
            </ModalWrap>
          </ModalContainer>
        </ModalWindow>
      )}
      {!!isKiltOpen && (
        <ModalWindow className="modal-window">
          <ModalContainer>
            <ModalWrap className="modal-wrap">
              <WModalBody>
                <img src="/assets/bird-white.svg" alt="" />
                <h3 className="success-title">Connect your wallet</h3>
                <div className="wallet-list">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {kiltAccounts.map((kiltAccount, index) => (
                      <WModalWalletButton
                        key={index}
                        onClick={() => saveKiltWallet(kiltAccount)}
                      >
                        <Identicon
                          value={kiltAccount.address}
                          size={44}
                          theme={"polkadot"}
                          style={{ marginRight: 20 }}
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span>{kiltAccount.meta.name}</span>
                          <span
                            style={{
                              fontSize: 12,
                              wordBreak: "break-all",
                              textTransform: "none",
                            }}
                          >
                            {shorter(kiltAccount.address)}
                          </span>
                        </div>
                      </WModalWalletButton>
                    ))}
                  </div>
                </div>
              </WModalBody>
              <WModalFooter>
                <WModalCloseButton onClick={() => setIsKiltOpen(false)}>
                  CLOSE
                </WModalCloseButton>
              </WModalFooter>
            </ModalWrap>
          </ModalContainer>
        </ModalWindow>
      )}
    </AppContainer>
  </ThemeProvider>
);
}

export default App;
    