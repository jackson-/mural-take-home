import React, { useEffect, useState } from "react";
import {ethers} from "ethers";

import './Dashboard.css';

const Dashboard = () => {
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
        const escanProvider = new ethers.providers.EtherscanProvider();
        const history = await escanProvider.getHistory(account);
        setCurrentAccount(accounts[0]);
        setCurrentNetwork(chainId);
        setBalance(balanceInEther);
        setTransactions(history);
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
      console.log("HASH: ", transactionHash)
    } catch(error) {
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

  const renderTransactionTable = () => {
    return(
      <div className="transaction-table-container">
        <h3>Transaction History</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>Amount</th>
              <th>To Address</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(( tx, idx ) => {
              if(idx < 10){
                return (
                  <tr key={idx}>
                    <td><a href={`https://goerli.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noreferrer">{tx.hash}</a></td>
                    <td>{ethers.utils.formatEther(tx.value)}</td>
                    <td>{tx.to}</td>
                    <td>{new Date(tx.timestamp*1000).toUTCString()}</td>
                  </tr>
                );
              }
              return false
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const renderDashboard = () => {
    return (
      <div className="dashboard-container">
        <h2>Your Dashboard goes here</h2>
        {/* Check to make sure wallet is on Goerli */}
        {renderBalance()}
        {currentNetwork === 5 &&
          renderTransactionForm()
        }
        {renderTransactionTable()}
      </div>
    )
  }

  useEffect(() => {
		connectWallet();
    checkForWalletChanges();
	});

	return (
		<div className="Dashboard App">
			<div className="container">
				{!currentAccount && renderNotConnectedContainer()}
				{/* Render the dashboard if an account is connected */}
        {currentAccount && currentNetwork !== 5 &&
          <p>Please switch your network to Goerli</p>
        }
				{currentAccount && currentNetwork === 5 && renderDashboard()}
        
			</div>
		</div>
	);
}

export default Dashboard;