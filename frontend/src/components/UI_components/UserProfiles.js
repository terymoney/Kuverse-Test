import React from "react";
import styled from "styled-components";
import { device } from "../../components/devices";
import { useTheme } from "../../context/themeContext";
import { useWeb3React } from "@web3-react/core";
import Identicon from "@polkadot/react-identicon";
import { shorter } from "../../utils"; // Correct import path

const TechCenterInnerContentTop = styled.div`
  margin: 0 auto;

  @media ${device.mobile} {
    margin: 19px auto 0;
  }
`;

const HrTag = styled.hr`
  @media ${device.mobile} {
    display: none;
  }
`;

const ProfileImageIcon1 = styled.img`
  width: 20px;
  height: 20px;
`;

const Profile = styled.div`
  display: flex;
  gap: 23px;
  width: 350px;
  margin: 0 auto;
  margin-top: 59px;
  @media ${device.mobile} {
    gap: 10px;
    margin-top: 16px;
  }
`;

const ProfileDetail = styled.div`
  /* Add styles for tech-center-inner-content-profile-detail here */
`;

const ProfileDetailText = styled.p`
  background: linear-gradient(180deg, #00beee 0%, #0087d1 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1px;
  display: flex;
  gap: 7px;
`;

const MetaMaskProfile = ({ account, handleLogout }) => (
  <Profile>
    <ProfileImage className="jbSDkt">
      <Identicon value={account} size={103} theme={"polkadot"} />
    </ProfileImage>
    <ProfileDetail>
      <ProfileDetailText>
        {shorter(account)}{" "}
      </ProfileDetailText>
      <button onClick={handleLogout}>Logout</button>
    </ProfileDetail>
  </Profile>
);

const ProfileImage = styled.div`
  width: 103px;
  height: 103px;
  border-radius: 50%;
  border: 4px solid #008ad2;
  display: flex;
  justify-content: center;
  align-items: center;
  & > img {
    background: #eeeeee;
    border-radius: 50%;
    width: 100%;
    height: auto;
    margin: 4px;
    padding: 5px;
  }
`;

const TechCenterInnerContent = () => {
  const { theme } = useTheme();
  const { account, deactivate } = useWeb3React();

  const handleLogout = async () => {
    deactivate();
    window.localStorage.removeItem("connectorLocalStorageKey");
  };

  return (
    <TechCenterInnerContentTop className="w-100 px-4">
      {/* MetaMask Profile Section */}
      {account ? (
        <MetaMaskProfile account={account} handleLogout={handleLogout} />
      ) : (
        <>
          {/* Rest of your component when no MetaMask account is connected */}
        </>
      )}
      <HrTag
        style={{
          maxWidth: 400,
          margin: "37px auto 0",
          border: "1px solid #DCDCDC",
        }}
      />
    </TechCenterInnerContentTop>
  );
};

export default TechCenterInnerContent;



