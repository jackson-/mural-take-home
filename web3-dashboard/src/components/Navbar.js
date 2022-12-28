import React from "react";
import { NavLink as Link } from "react-router-dom";

import '../App.css';

const Dashboard = () => {
    return(
        <div>
            <Link to='/'><h1>My Web3 Dashboard</h1></Link>
            <Link to='/multisig'><button>Multisig Wallet</button></Link>
        </div>
    )
}

export default Dashboard;