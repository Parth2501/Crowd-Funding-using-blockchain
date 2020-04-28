const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const Campaign = require('../ethereum/build/Campaign.json')
const Factory = require('../ethereum/build/Factory.json')

const web3 = new Web3(ganache.provider())
const abiFactory=Factory['abi']
const codeFactory = Factory['evm'].bytecode.object
const abiCampaign=Campaign['abi']
const codeCampaign = Campaign['evm'].bytecode.object

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts()
    factory = await new web3.eth.Contract(abiFactory).deploy({data: codeFactory}).send({from: accounts[0],gas: 1000000})
    await factory.methods.createCampaign('100').send({from:accounts[0],gas:'1000000'})
    let address = await factory.methods.getDeployedCampaign().call();
    campaignAddress = address[0];
    // console.log(address)
    campaign = await new web3.eth.Contract(abiCampaign,campaignAddress);
    // console.log(campaign.methods);
})

describe('camapign',()=>{
    it('deployed or not',()=>{
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('can access manager or not',async ()=>{
        const manager = await campaign.methods.manager().call({
            from: accounts[0]
        })
        assert.equal(accounts[0],manager)
    })

    it('to check approvers',async ()=>{
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        })

        const isApprover = await campaign.methods.approvers(accounts[1]).call({
            from: accounts[0]
        })

        assert(isApprover)
    })

    it('allows manager to create request',async ()=>{
        await campaign.methods.createRequest('Buy batteries',accounts[2],'100').send({
            from: accounts[0],
            gas: '1000000'
        })

        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries',request.description)
    })

    it('prohibit others to create request',async ()=>{
        try{
            await campaign.methods.createRequest('Buy batteries',accounts[2],'100').send({
                from: accounts[1],
                gas: '1000000'
            })
            assert(false)
        }catch(err){
            assert.ok(err)
        }
    })

    it('requires minimum contribution',async ()=>{
        try{
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: '99'
            })
            assert(false)
        }catch(err){
            assert.ok(err)
        }
        
    })
})