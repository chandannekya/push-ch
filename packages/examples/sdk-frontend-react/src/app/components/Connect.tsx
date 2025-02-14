import { useEffect } from 'react';
import styled from 'styled-components';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';

interface NwMappingType {
  [key: number]: string;
}

const NETWORK_MAPPING: NwMappingType = {
  1: 'ETH_MAIN_NET',
  11155111: 'ETH_SEPOLIA',
  3: 'ETH_ROPSTEN',
  137: 'POLYGON_MAINNET',
  80001: 'POLYGON_MUMBAI',
  56: 'BSC_MAINNET',
  97: 'BSC_TESTNET',
  420: 'OPTIMISM_TESTNET',
  10: 'OPTIMISM_MAINNET',
  1442: 'POLYGON_ZK_EVM_TESTNET',
  1101: 'POLYGON_ZK_EVM_MAINNET',
  421613: "ARBITRUM_TESTNET",
  42161: "ARBITRUMONE_MAINNET"
};

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 11155111, 42, 137, 80001, 56, 97, 10, 420, 1442, 1101, 421613, 42161],
})

const ConnectWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20;

  & .account {
    font-size: 1.2rem;
    border: 1px solid green;
    border-radius: 3px;
    padding: 4px 7px;
    font-weight: 500;
    font-family: monospace;
  }

  & .network {
    margin: 5px 0;
  }
`;

const StyledButton = styled.button`
  border: 0px;
  outline: 0px;
  padding: 8px 15px;
  margin: 10px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
`;

const Connect = styled(StyledButton)`
  color: rgb(255, 255, 255);
  background: rgb(103, 76, 159);
`;

const Disconnect = styled(StyledButton)`
  color: rgb(255, 255, 255);
  background: rgb(226, 8, 128);
`;

const ConnectButtonComp = () => {
  const { active, account, activate, deactivate, chainId } = useWeb3React();

  async function connect() {
    try {
      await activate(injected);
      localStorage.setItem('isWalletConnected', 'true');
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem('isWalletConnected', 'false');
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected);
          localStorage.setItem('isWalletConnected', 'true');
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, [activate]);

  return (
    <ConnectWrapper>
      {active ? (
        <>
          <p>
            Connected with <span className="account">{account}</span>
          </p>
          {chainId ? (
            <p className="network">{NETWORK_MAPPING[chainId]}</p>
          ) : null}
          <Disconnect onClick={disconnect}>Disconnect Metamask</Disconnect>
        </>
      ) : (
        <Connect onClick={connect}>Connect to MetaMask</Connect>
      )}
    </ConnectWrapper>
  );
};

export default ConnectButtonComp;
