const path=require('path');
const fs=require('fs-extra');
const solc=require('solc');

const buildPath=path.resolve(__dirname,'build');
fs.removeSync(buildPath)

let campaignPath=path.resolve(__dirname,'contracts','campaign.sol');

let source=fs.readFileSync(campaignPath,'utf8');

var input = {
    language: 'Solidity',
    sources: {
      'campaign.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  var output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['campaign.sol'];
  // console.log(output);

  for(let contract in output){
    // fs.outputFileSync(path.resolve(buildPath,contract+'.txt'),JSON.parse(output[contract]))
    fs.outputJsonSync(path.resolve(buildPath,contract+'.json'),output[contract])
  }

  module.exports = output;