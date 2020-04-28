import React,{Component} from 'react'
import Layout from '../../../Components/Layout'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import camapaignCreator from '../../../ethereum/campaign' 
import web3 from '../../../ethereum/web3'

class NewRequest extends Component{
    state = {
        description: '',
        recipient: '',
        value: '',
        errorMessage: '',
        loading: false
    }

    static async getInitialProps(props){
        return {
            address: props.query.address
        }
    }

    onSubmit = async (event)=>{
        const campaign = camapaignCreator(this.props.address)
        
        const {description,recipient,value} = this.state

        this.setState({loading:true,errorMessage:''})

        try{
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.createRequest(description,recipient,web3.utils.toWei(value,'ether')).send({
                from: accounts[0]
            })
        }catch(err){
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
                <h3>Create a spending request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Message error header='Oops..' content={this.state.errorMessage}/>
                    <Form.Field>
                        <label>Description</label>
                        <Input value={this.state.description} onChange={(event)=>{this.setState({description:event.target.value})}} />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input value={this.state.value} onChange={(event)=>{this.setState({value:event.target.value})}} />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input value={this.state.recipient} onChange={(event)=>{this.setState({recipient:event.target.value})}} />
                    </Form.Field>
                    <Button primary loading={this.state.loading}>Create</Button>
                </Form>
            </Layout>
        )
    }
}

export default NewRequest