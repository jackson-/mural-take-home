# Devin Jackson's Mural Challenge Submission

## Installation and setup
1. `cd web3-dashboard && npm i && npm start`
2. Go to localhost:3000 for part 1
3. Go to localhost:3000/multisig for part 2 

## part 1 - intro challenge: web3 login (goerli test net)
Create a basic web app that allows a user to login via metamask, send fake Ethereum (on the goerli test net), and load their previous transactions.
1. Allow user to login via [metamask chrome extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) or [wallet connect](https://walletconnect.com/).
2. Get some fake Eth from the [faucet](https://goerlifaucet.com/), switch your metamask to the goerli testnet
3. Create simple UI with a login button (opens up metamask login modal), displays user's current balance on the goerli testnet, allows user to send funds to another Ethereum address, displays user's previous transaction hashes in a table (linking each transaction hash to its respective etherscan link).

## part 2 - followup challenge: multi-sig creation
1. Allow user to setup a gnosis multi-sig wallet with an arbitrary number of approvers and a confirmation threshold ([gnosis](https://help.gnosis-safe.io/en/articles/3876461-create-a-safe)).
3. Create simple UI showing approvers, allowing user to edit the nickname for different addresses, changing approvers, as well as changing the confirmation threshold.
4. For testing of multi-sig wallet creation, get some fake eth from the [faucet](https://goerlifaucet.com/), switch your metamask to the goerli testnet, test by initiating transactions. 