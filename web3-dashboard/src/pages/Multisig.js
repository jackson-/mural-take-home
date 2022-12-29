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
            const safeAccountConfig = {owners: newOwners, threshold: newThreshold};
            console.log("CONFIG ", safeAccountConfig)
            const safeSdk = await safeFactory.deploySafe({safeAccountConfig});
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

    const addOwner = async (e) => {
        e.preventDefault();
        const newOwner = e.target[0].value;
        setOwnerInput('');
        setThresholdInput('');
        try{
            await safe.createAddOwnerTx(newOwner);
            const newOwners = [...owners]
            newOwners.push(newOwner)
            nickNames[newOwner] = ''
            setOwners(newOwners)
        } catch(error) {
            console.log(error);
        }
    }

    const editThreshold = async (e) => {
        e.preventDefault();
        const newThreshold = e.target[0].value;
        setOwnerInput('');
        setThresholdInput('');
        try{
            console.log(newThreshold, confirmationThreshold)
            if (newThreshold !== confirmationThreshold){
                await safe.createChangeThresholdTx(newThreshold);
                console.log('DONE ')
                setConfirmationThreshold(newThreshold);
            }
        } catch(error) {
            console.log(error);
        }
    }

    const removeOwner = async (owner) => {
        console.log(owner)
        try{
            await safe.createRemoveOwnerTx(owner);
            const index = owners.indexOf(owner);
            const newOwners = [...owners]
            newOwners.splice(index, 1)
            delete nickNames[owner]
            setOwners(newOwners)
        } catch(error) {
            console.log(error);
        }
    }


    // Render methods
    const renderWalletCreate = () => (
        <div className="multisig-form-container">
            <p>Create Safe</p>
            <form onSubmit={createWallet} className="multisig-create-form">
                <input type="text" value={ownerInput} onChange={(e) => setOwnerInput(e.target.value)} placeholder="Owner addresses seperated by comma"></input>
                <input type="number" value={thresholdInput} onChange={(e) => setThresholdInput(e.target.value)} placeholder="Confirmation threshold"></input>
                <button type="submit">Submit</button>
            </form>
        </div>
    )

    const renderWalletEdit = () => (
        <div className="multisig-form-container">
            <p>Add Owner</p>
            <form onSubmit={addOwner} className="edit-owners-form">
                <input type="text" value={ownerInput} onChange={(e) => setOwnerInput(e.target.value)} placeholder="Owner addresses seperated by comma"></input>
                <button type="submit">Submit</button>
            </form>
            <p>Change Threshold</p>
            <form onSubmit={editThreshold} className="edit-threshold-form">
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
                            <td><button onClick={() => removeOwner(owner)}>Remove</button></td>
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
            {!safe && renderWalletCreate()}
            {safe && renderWalletEdit()}
            {safe && renderOwnerTable()}
        </div>
    )
}

export default Multisig;