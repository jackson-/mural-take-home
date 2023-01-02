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
    const [errorMessage, setErrorMessage] = useState('');
    
    const nickNames = {}

    const createWallet = async (e) => {
        e.preventDefault();
        const inputOwners = e.target[0].value.replace(/\s/g,'').split(',');
        const inputThreshold = e.target[1].value;
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
            const safeAccountConfig = {owners: inputOwners, threshold: inputThreshold};
            const safeSdk = await safeFactory.deploySafe({safeAccountConfig});
            const newOwners = await safeSdk.getOwners();
            for (let owner in newOwners) {
                nickNames[owner] = '';
            }
            setConfirmationThreshold(inputThreshold);
            setOwners(newOwners);
            setSafe(safeSdk);
        } catch(error) {
            console.log(error);
            setErrorMessage(error)
        }
    }

    const addOwner = async (e) => {
        e.preventDefault();
        const newOwner = e.target[0].value;
        setOwnerInput('');
        setThresholdInput('');
        try{
            const safeTransaction = await safe.createAddOwnerTx({ownerAddress:newOwner, newThreshold:confirmationThreshold});
            const txResponse = await safe.executeTransaction(safeTransaction)
            await txResponse.transactionResponse?.wait()
            const newOwners = await safe.getOwners();
            nickNames[newOwner] = ''
            setOwners(newOwners)
        } catch(error) {
            console.log(error);
            setErrorMessage(error)
        }
    }

    const editThreshold = async (e) => {
        e.preventDefault();
        const newThreshold = e.target[0].value;
        setOwnerInput('');
        setThresholdInput('');
        try{
            if (newThreshold !== confirmationThreshold){
                const safeTransaction = await safe.createChangeThresholdTx(newThreshold)
                const txResponse = await safe.executeTransaction(safeTransaction)
                await txResponse.transactionResponse?.wait()
                setConfirmationThreshold(newThreshold);
            }
        } catch(error) {
            console.log(error);
            setErrorMessage(error)
        }
    }

    const removeOwner = async (removedOwner) => {
        try{
            const safeTransaction = await safe.createRemoveOwnerTx({ownerAddress:removedOwner, threshold:confirmationThreshold})
            const txResponse = await safe.executeTransaction(safeTransaction)
            await txResponse.transactionResponse?.wait()
            delete nickNames[removedOwner]
            const newOwners = await safe.getOwners();
            setOwners(newOwners)
        } catch(error) {
            console.log(error);
            setErrorMessage(error)
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
            <p>{errorMessage}</p>
            {safe && <p>Confirmation Threshold: {confirmationThreshold}</p>}
            {!safe && renderWalletCreate()}
            {safe && renderWalletEdit()}
            {safe && renderOwnerTable()}
        </div>
    )
}

export default Multisig;