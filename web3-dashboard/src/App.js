import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Dashboard from "./pages/Dashboard";
import Multisig from "./pages/Multisig";
import Navbar from './components/Navbar'

import './App.css';

const App = () => {

    return(
      <Router>
        <Navbar />
        <Routes>
            <Route exact path='/' element={<Dashboard />} />
            <Route path='/multisig' element={<Multisig />} />
        </Routes>
      </Router>
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