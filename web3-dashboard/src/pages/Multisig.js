import React, {useState} from "react";
// import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
import {ethers} from "ethers";

import "./Multisig.css"; 

const Multisig = () => {
    const [confirmationThreshold, setConfirmationThreshold] = useState(0);
    const [owners, setOwners] = useState([]);
    const [safe, setSafe] = useState('');
    
    const nickNames = {}

    // const createWallet = (e) => {
    //     e.preventDefault();
    //     const ownerAddresses = e.target[0].value.split(',');
    //     const threshold = e.target[1].value;
    //     try{
    //         setConfirmationThreshold(threshold);
    //         setOwners(ownerAddresses);
    //         const safeAccountConfig = new SafeAccountConfig(ownerAddresses, threshold);
    //         const safeFactory = new SafeFactory.create({ ethAdapter });
    //         const safe = safeFactory.deploySafe(safeAccountConfig);
    //         setSafe(safe);
    //     } catch(error) {
    //         console.log(error);
    //         debugger;
    //     }
    // }


    // Render methods

    const renderWalletForm = (safe) => (
        <div className="multisig-form-container">
            {safe ? <p>Edit Safe:</p> : <p>Create Safe</p>}
            <form className="multisig-create-form">
                <input type="text" placeholder="Owner addresses seperated by comma"></input>
                <input type="number" placeholder="Confirmation threshold"></input>
                {/* <button onClick={createWallet}>Submit</button> */}
            </form>
        </div>
    )

    const renderEditForm = () => (
        <div className="multisig-edit-form-container">
            
            <p>Add Owners</p>
            <form className="multisig-create-form">
                <input type="text" placeholder="Owner addresses seperated by comma"></input>
                <input type="number" placeholder="Confirmation threshold"></input>
                <button>Submit</button>
            </form>
        </div>
    )
    
    const renderOwnerTable = () => (
        <div>
            <table>
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
                            <td><a href={`https://etherscan.io/address/${owner.address}`} target="_blank" rel="noreferrer">{owner.address}</a></td>
                            <td>{nickNames[owner.address]}</td>
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