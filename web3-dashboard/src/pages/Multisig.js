import React, {useState} from "react";

import "./Multisig.css"; 

const Multisig = () => {
    const [confirmationThreshold, setConfirmationThreshold] = useState(0);
    const [owners, setOwners] = useState([]);
    const [safe, setSafe] = useState('');
    
    const nickNames = {}


    // Render methods

    const renderSetupForm = (safe) => (
        <div className="multisig-create-form-container">
            {safe ? <p>Edit Safe:</p> : <p>Create Safe</p>}
            <form className="multisig-create-form">
                <input type="text" placeholder="Owner addresses seperated by comma"></input>
                <input type="number" placeholder="Confirmation threshold"></input>
                <button>Submit</button>
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
            {renderSetupForm(safe)}
            {safe && renderOwnerTable()}
        </div>
    )
}

export default Multisig;