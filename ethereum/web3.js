import Web3 from 'web3';

// console.log(window.ethereum)
let web3;
const ethEnabled = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum  !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
            // web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
            console.log('couldnot enable ethereum')
        }
    }
    // Legacy dapp browsers...
    else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider);
        // Acccounts always exposed
        // web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/fca312fc8aca488c9f52868863e340a0")
        web3 = new Web3(provider);
    }

  }

  ethEnabled();

export default web3;