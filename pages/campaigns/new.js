import React , { Component } from 'react'
import Layout from '../../Components/Layout'
import {Form,Button,Input,Message} from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import {Router} from '../../routes'

class CampaignNew extends Component{

    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async ()=>{

        this.setState({loading:true,errorMessage:''})
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution).send({
                from:accounts[0]
            })
            Router.pushRoute('/')
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
        <Layout>
            <h1>Create Campaign</h1>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Message error header='Oops..' content={this.state.errorMessage}/>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input value={this.state.minimumContribution} onChange={(event)=>{this.setState({minimumContribution:event.target.value})}} label='wei' labelPosition='right' />
                </Form.Field>
                <Button primary loading={this.state.loading}>Create</Button>
            </Form>
        </Layout>
        )
    }
}

export default CampaignNew;