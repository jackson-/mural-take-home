import React, {useState} from "react";


const Multisig = () => {
    const [confirmationThreshold, setConfirmationThreshold] = useState(0);
    const [owners, setOwners] = useState([]);

    return (
        <div className="multisig-container">
            <h1>Multisig Wallet</h1>
            <form className="multisig-create-form">
                <input type="text" placeholder="Owner addresses seperated by comma"></input>
                <input type="number" placeholder="Confirmation threshold"></input>
            </form>
            <div>
                <p>Confirmation Threshold: </p>
                <table>
                    <thead>
                        <tr>
                            <th>Owner Address</th>
                            <th>Nickname</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default Multisig;