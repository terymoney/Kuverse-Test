import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import Identicon from "@polkadot/react-identicon";
import { shorter } from "../../../utils";
import {
  Inventory,
  InventoryItems,
  InventoryItemsDiv,
  LastDiv,
  Lasttext,
  ProfileContainer,
  Seperater,
} from "./ProfileStyles";
import { TextSapn } from "../../styles/Common";
import { getNativeBalance, getTokenBalance } from "../../../utils/contracts";
import { StatusButton } from "../../UI_components/OverlayComponents";
import { PlayerCard } from "./PlayerCard";
import { OverlayModal } from "../../UI_components/OverlayComponents";
import { testOwnedItems, testSaleItems } from "./data";

const MetaMaskProfile = ({ account, handleLogout }) => (
  <div className="profile">
    <Identicon value={account} size={44} theme={"polkadot"} />
    <div>
      <p>{shorter(account)}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  </div>
);

export const Profile = (props) => {
  const [toggle, setToggle] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [nativeBalance, setNativeBalance] = useState(0);

  function openOverlay(item) {
    setModalItem(item);
    setToggle(true);
  }

  function closeOverlay() {
    setModalItem(null);
    setToggle(false);
  }

  const [profileUser, setProfileUser] = useState(null);
  useEffect(() => {
    if (props.user) {
      setProfileUser(props.user);
    }
  }, [props]);

  const { account, deactivate } = useWeb3React();
  const [saleItems, setSaleItems] = useState([...testSaleItems]);
  const [ownedItems, setOwnedItems] = useState([...testOwnedItems]);

  const handleLogout = async () => {
    deactivate();
    window.localStorage.removeItem("connectorLocalStorageKey");
  };

  return (
    <>
      {props.kiltWallet ? (
        <>
          {!account && (
            <StatusButton
              onClick={() => props.connectAccount()}
              style={{ width: "auto", padding: "0 20px" }}
            >
              CONNECT METAMASK
            </StatusButton>
          )}
          {account && (
            <ProfileContainer>
              <OverlayModal
                {...props}
                item={modalItem}
                isOpen={toggle}
                closeOverlay={closeOverlay}
              />
              <MetaMaskProfile account={account} handleLogout={handleLogout} />
              <Inventory>
                <InventoryItemsDiv>
                  {ownedItems.map((item, index) => (
                    <InventoryItems
                      key={index}
                      style={{ textAlign: "center", padding: "2%" }}
                      onClick={() => openOverlay(item)}
                    >
                      {item.assetType === "video" ? (
                        <video
                          autoPlay="autoplay"
                          loop={true}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 25,
                          }}
                        >
                          <source src={item.mainData} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={item.mainData}
                          style={{ height: "100%" }}
                          alt="Inventory"
                        />
                      )}
                    </InventoryItems>
                  ))}
                </InventoryItemsDiv>
                <TextSapn style={{ fontWeight: 700, fontSize: "14px" }}>
                  INVENTORY
                </TextSapn>
              </Inventory>

              <PlayerCard user={profileUser} />

              <Inventory>
                <InventoryItemsDiv>
                  {saleItems.map((item, index) => (
                    <InventoryItems
                      key={index}
                      style={{ textAlign: "center", padding: "2%" }}
                      onClick={() => openOverlay(item)}
                    >
                      {item.assetType === "video" ? (
                        <video
                          autoPlay="autoplay"
                          loop={true}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 25,
                          }}
                        >
                          <source src={item.mainData} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={item.mainData}
                          style={{ height: "100%" }}
                          alt="Inventory"
                        />
                      )}
                    </InventoryItems>
                  ))}
                </InventoryItemsDiv>
                <TextSapn style={{ fontWeight: 700, fontSize: "14px" }}>
                  LISTED FOR SALE
                </TextSapn>
              </Inventory>
              <Lasttext>
                <LastDiv>
                  <TextSapn>{parseFloat(tokenBalance).toFixed(2)}</TextSapn>
                </LastDiv>
                <LastDiv>
                  <TextSapn>kORE</TextSapn>
                </LastDiv>
                <Seperater></Seperater>
                <LastDiv>
                  <TextSapn>{parseFloat(nativeBalance).toFixed(3)}</TextSapn>
                </LastDiv>
                <LastDiv>
                  <TextSapn>{process.env.REACT_APP_COIN}</TextSapn>
                </LastDiv>
              </Lasttext>
            </ProfileContainer>
          )}
        </>
      ) : (
        <>
          <div className="w-100 tab-w-385 profilepage">
            <div className="mobile-hidden">
              <div className="tech-center-inner">
                <div>
                  <div>
                    <div className="userscontent">
                      {/* Remove static profile card images */}
                      {/* <img className="d-none-dark" src="/images/profile-card-w.png" alt="" />
                      <img className="d-none-white" src="/images/profile-card.png" alt="" /> */}
                    </div>
                    <div className="tech-profile-lines">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
            <div>
              <div className="profile-bd-img">
                {/* Remove background images */}
                {/* <img className="d-none-white" src="/images/Vector.png" alt="" />
                <img className="d-none-dark" src="/images/Vector.png" alt="" /> */}
              </div>
              <div className="profile-btn">
                <StatusButton
                  className="profile-bg-btn"
                  onClick={() => props.connectSporran()}
                  style={{ padding: "0 20px" }}
                >
                  LOGIN WITH &nbsp;{" "}
                  {/* Remove sporran logo image */}
                  {/* <img src="/images/kilt-logo.png" style={{ width: 50, height: 20 }} alt="Kilt-Logo" /> */}
                </StatusButton>

                <StatusButton
                  onClick={() => {
                    alert("Coming soon ...");
                  }}
                  style={{ padding: "0 20px" }}
                >
                  LOGIN WITH EMAIL
                </StatusButton>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

