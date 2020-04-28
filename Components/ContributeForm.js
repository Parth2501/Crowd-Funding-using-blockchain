import React,{Component} from 'react'
import {Button,Form,Input,Message} from 'semantic-ui-react'
import campaignCreator from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { Router } from '../routes'

class ContributionForm extends Component{

    state = {
        Contribution: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async ()=>{

        this.setState({loading:true,errorMessage:''})
        try{
            const campaign = campaignCreator(this.props.address)
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.Contribution,'ether') 
            })
            Router.replaceRoute(`/campaigns/${this.props.address}`)
        }catch(err)
        {
            this.setState({
                errorMessage:err.message
            })
        }
        this.setState({loading:false})
        return false;
    }

    render(){
       return (
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
           <Message error header='Oops..' content={this.state.errorMessage}/>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input label='ether' labelPosition='right' value={this.state.Contribution} onChange={(event)=>{this.setState({Contribution:event.target.value})}}></Input>
                </Form.Field>
                <Button primary loading={this.state.loading}>Contribute</Button>  
        </Form>
        )
    }
}

export default ContributionForm;