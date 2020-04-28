import web3 from './web3'
import Factory from './build/Factory.json'
// const Factory = require('./build/Factory.json')
const instance = new web3.eth.Contract(Factory['abi'],'0x2c6bF16C9823237D86466f65f5B080E852FA52bf');
// console.log(instance);

export default instance;