import React,{Component} from 'react'
import Layout from '../../../Components/Layout'
import {Link} from '../../../routes'
import { Button, Table , Menu, Message } from 'semantic-ui-react'
import camapaignCreator from '../../../ethereum/campaign' 
import web3 from '../../../ethereum/web3'
import RequestRow from '../../../Components/RequestRow'

class RequestList extends Component{

    state={
        errorMessage: '',
        notificationMessage: '',
        waitingMessage: ''
    }

    static async getInitialProps(props){
        const address = props.query.address
        const campaign = camapaignCreator(address)
        const requestCount = await campaign.methods.getRequest().call();
        const approvers = await campaign.methods.count().call();
        const accounts = await web3.eth.getAccounts()

        const requests = await Promise.all(
        Array(parseInt(requestCount))
            .fill()
            .map((element, index) => {
            return campaign.methods.requests(index).call();
            })
        );

        return {
            requests,
            address,
            approvers,
            accounts
        }
    }

    approveRequest=async (index)=>{
        // const accounts = this.props.accounts
        // console.log(accounts)
        this.setState({
            waitingMessage: 'Please wait for sometime until network confirm the transaction',
            errorMessage: '',
            notificationMessage: ''
        })
        try{
            const accounts=await web3.eth.getAccounts();
            const campaign = camapaignCreator(this.props.address)
            await campaign.methods.approveRequest(index).send({
                from: accounts[0]
            })
            this.setState({
                notificationMessage: 'Your request is confirmed,please refresh the page to see change',
                waitingMessage: ''
            })
        }catch(err){
            if(err)
                this.setState({
                    errorMessage: 'Error in voting,Either you  are not a valid approver or You have already voted',
                    waitingMessage: ''
                })
        }
    }

    finalizeRequest= async (index)=>{
        this.setState({
            waitingMessage: 'Please wait for sometime until network confirm the transaction',
            errorMessage: '',
            notificationMessage: ''
        })
        try{
            const accounts=await web3.eth.getAccounts();
            console.log(accounts)
            const campaign = camapaignCreator(this.props.address)
            await campaign.methods.finalizeRequest(index).send({
                from: accounts[0]
            })
            this.setState({
                notificationMessage: 'Your request is confirmed,please refresh the page to see change',
                waitingMessage: ''
            })
        }catch(err){
            if(err)
                this.setState({
                    errorMessage: 'You are not authorized to final this request',
                    waitingMessage: ''
                })
        }
    }

    RenderRows(){
        return (
            <Table.Body>

                {this.props.requests.map((request,index)=>{
                    return <RequestRow key={index} onFinal={this.finalizeRequest} onApprove={this.approveRequest} index={index+1} request={request} approvers={this.props.approvers}/>
                })}
            </Table.Body>
        )
    }

    render(){
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button floated='right' primary>New Request</Button>
                    </a>
                </Link>
                <h3>Request List</h3>
                <Table>
                    <Table.Header>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Approval Count</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Header>
                    {this.RenderRows()}
                </Table>
                <Message hidden={!this.state.waitingMessage} header='Processing...' content={this.state.waitingMessage} />
                <Message hidden={!this.state.notificationMessage} header='Hurray!' content={this.state.notificationMessage} />
                <Message hidden={!this.state.errorMessage} error header='Oops' content={this.state.errorMessage} /> 
            </Layout>
        )
    }
}

export default RequestList;