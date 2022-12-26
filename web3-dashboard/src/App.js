import React, { useEffect, useState } from "react";
import {ethers} from "ethers";

import './App.css';

const App = () => {
  const network = 'goerli';
  const [currentAccount, setCurrentAccount] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [balance, setBalance] = useState(0);
  const [toAddress, setToAddress] = useState('');
  const [sendAmount, setSendAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [transactions, setTransactions] = useState([]);


  // Wallet methods
  
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
        const balance = await provider.getBalance(accounts[0])
        const balanceInEther = ethers.utils.formatEther(balance)
        console.log("BALANCE ", balanceInEther)
        console.log('Found an authorized account:', account);
        console.log("Chain ID: ", chainId)
        setCurrentAccount(accounts[0]);
        setCurrentNetwork(chainId);
        setBalance(balanceInEther);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error)
    }
  }

  const sendTransactionClicked = async (e) => {
    e.preventDefault();
    const ethereum = window.ethereum;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const params = [{
      from: currentAccount,
      to: toAddress,
      value: ethers.utils.parseUnits(sendAmount, 'ether').toHexString()
    }];
    try{
      const transactionHash = await provider.send('eth_sendTransaction', params)
      console.log('transactionHash is ' + transactionHash);
    } catch(error) {
      console.log("ERROR ", error)
      setErrorMessage(error.message)
    }
  }

  // Render methods

  const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
      {/* Call the connectWallet function we just wrote when the button is clicked */}
			<button onClick={() => connectWallet(true)} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	);

  const renderBalance = () => {
    return(
      <div className="balance-container">
        <p className="balance">Your current balance: {balance} Goerli ETH</p>
      </div>
    )
  }
  
  const renderTransactionForm = () => {
    return(
      <div className="transaction-form-container">
        <h3>Send a transaction</h3>
        <p className="transaction-error">{errorMessage}</p>
        <form className="transaction-form">
          <input
            type="text"
            value={toAddress}
            placeholder="Enter wallet address (Ox...) or ENS domain to send to"
            onChange={e => setToAddress(e.target.value)}
          />
          <input
            type="number"
            value={sendAmount}
            placeholder="ETH amount to send"
            onChange={e => setSendAmount(e.target.value)}
          />
          <button onClick={sendTransactionClicked}>Send</button>
        </form>
      </div>
    )
  }

  const renderDashboard = () => {
    return (
      <div className="dashboard-container">
        <h2>Your Dashboard goes here</h2>
        {/* Check to make sure wallet is on Goerli */}
        {renderBalance()}
        {currentNetwork == 5 &&
          renderTransactionForm()
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
        {currentAccount && currentNetwork != 5 &&
          <p>Please switch your network to Goerli</p>
        }
				{currentAccount && currentNetwork == 5 && renderDashboard()}
        
			</div>
		</div>
	);
}

export default App;
