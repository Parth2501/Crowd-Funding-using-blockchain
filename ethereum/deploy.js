const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const Factory = require('./build/Factory.json')
// const {abi, evm} = require('./compile')

let code = Factory['evm'].bytecode.object
code = '0x'+code;

const mnemonic = 'differ two rookie have series pledge crisp switch cake curious pipe main'

let provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/fca312fc8aca488c9f52868863e340a0");
const web3 = new Web3(provider)

const deploy = async ()=>{

    const accounts = await web3.eth.getAccounts()
    
    console.log('Attempting to deploy from account',accounts[0]);
    const inbox = await new web3.eth.Contract(Factory['abi']).deploy({data: code})
    try{    
        const result = await inbox.send({from: accounts[0]})
        console.log('contract address is ',result.options.address) //0xcf14FD32533A74e8De2ed8767eec78f0A8f0f1d9
    }catch(e){
        console.log(e)
    }
}

deploy();