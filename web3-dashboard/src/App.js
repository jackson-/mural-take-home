import React, { useEffect, useState } from "react";
import {ethers} from "ethers";

import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('');

  const setAccountAndNetwork = async () => {

  }

  
  const checkForWalletChanges = async () => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        connectWallet()
      })
      window.ethereum.on('accountsChanged', () => {
        connectWallet()
      })
    }
  }

  const connectWallet = async (clicked=false) => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        clicked ? alert("You need MetaMask or WalletConnect to access our site :)") : console.log("This user needs MetaMask or WalletConnect to access our site :)");
        return;
      }
			
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork()
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        console.log("Chain ID: ", chainId)
        setCurrentAccount(accounts[0]);
        setCurrentNetwork(chainId);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
      {/* Call the connectWallet function we just wrote when the button is clicked */}
			<button onClick={() => connectWallet(true)} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	);

  const renderDashboard = () => {
    return (
      <div className="dashboard-container">
        <h2>Your Dashboard goes here</h2>
        {currentNetwork != 5 &&
          <p>Please switch your network to Goerli</p>
        }
      </div>
    )
  }

  useEffect(() => {
		connectWallet();
    checkForWalletChanges();
	}, []);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<header>
						<div className="header">
							<p className="title">My Web3 Dashboard</p>
							<p className="subtitle">All your web3 needs in one place</p>
						</div>
					</header>
				</div>
				
				{!currentAccount && renderNotConnectedContainer()}
				{/* Render the dashboard if an account is connected */}
				{currentAccount && renderDashboard()}
			</div>
		</div>
	);
}

export default App;
