import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from './components/Navbar'

import './App.css';

const App = () => {

    return(
      <div>
        <Navbar />
        <Outlet />
      </div>
    )
  
}

export default App;


// const { ethers } = require('ethers');
// const { Safe } = require('safe-core-sdk');

// async function changeApproversAndThreshold(safeAddress, provider, operation, newApprovers, threshold) {
//   // Create a Safe object using the address of the Safe contract
//   const safe = new Safe(safeAddress, provider);

//   // Change the approvers for an operation
//   await safe.changeApprovers(operation, newApprovers);

//   // Change the confirmation threshold for an operation
//   await safe.changeThreshold(operation, thres