import React, {useState} from "react";
import { SafeFactory } from '@gnosis.pm/safe-core-sdk'

import EthersAdapter from '@safe-global/safe-ethers-lib'
import {ethers} from "ethers";

import "./Multisig.css"; 

const Multisig = () => {
    const [confirmationThreshold, setConfirmationThreshold] = useState(0);
    const [owners, setOwners] = useState([]);
    const [ownerInput, setOwnerInput] = useState('');
    const [thresholdInput, setThresholdInput] = useState('');
    const [safe, setSafe] = useState('');
    
    const nickNames = {}

    const createWallet = async (e) => {
        e.preventDefault();
        const newOwners = e.target[0].value.replace(/\s/g,'').split(',');
        const newThreshold = e.target[1].value;
        setOwnerInput('');
        setThresholdInput('');
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const safeOwner = provider.getSigner(0)
            const ethAdapter = new EthersAdapter({
                ethers,
                signerOrProvider: safeOwner
            })
            const safeFactory = await SafeFactory.create({ ethAdapter });
            console.log("FACTORY ", safeFactory)
            const safeAccountConfig = {newOwners, newThreshold};
            console.log("CONFIG ", safeAccountConfig)
            const safeSdk = await safeFactory.deploySafe({safeAccountConfig});
            debugger
            for (let owner in newOwners) {
                nickNames[owner] = '';
            }
            setConfirmationThreshold(newThreshold);
            setOwners(newOwners);
            setSafe(safeSdk);
        } catch(error) {
            console.log(error);
        }
    }

    const editWallet = async (e) => {
        e.preventDefault();
        const newOwners = e.target[0].value.split(',');
        const newThreshold = e.target[1].value;
        setOwnerInput('');
        setThresholdInput('');
        try{
            if (owners.sort() !== newOwners.sort()){
                debugger
            }
            if (newThreshold !== confirmationThreshold){
                debugger
            }
        } catch(error) {
            console.log(error);
        }
    }


    // Render methods
    const renderWalletForm = (safe) => (
        <div className="multisig-form-container">
            {safe ? <p>Edit Safe:</p> : <p>Create Safe</p>}
            <form onSubmit={safe ? editWallet : createWallet} className="multisig-create-form">
                <input type="text" value={ownerInput} onChange={(e) => setOwnerInput(e.target.value)} placeholder="Owner addresses seperated by comma"></input>
                <input type="number" value={thresholdInput} onChange={(e) => setThresholdInput(e.target.value)} placeholder="Confirmation threshold"></input>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
    
    const renderOwnerTable = () => (
        <div>
            <table className="owner-table">
                <thead>
                    <tr>
                        <th>Owner Address</th>
                        <th>Nickname</th>
                    </tr>
                </thead>
                <tbody>
                    {owners.map(( owner, idx ) => {
                        return (
                        <tr key={idx}>
                            <td><a href={`https://etherscan.io/address/${owner}`} target="_blank" rel="noreferrer">{owner}</a></td>
                            <td><input value={nickNames[owner]} onChange={(e) => {nickNames[owner] = e.target.value}}></input></td>
                            <td><button>Remove</button></td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="multisig-container">
            <h1>Multisig Wallet</h1>
            {safe && <p>Confirmation Threshold: {confirmationThreshold}</p>}
            {renderWalletForm(safe)}
            {safe && renderOwnerTable()}
        </div>
    )
}

export default Multisig;