import React,{Component} from 'react'
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';

class RequestRow extends Component{

    callingFunction(){
        this.props.onApprove(this.props.index - 1);
    }

    anotherOne(){
        this.props.onFinal(this.props.index - 1);
    }

    render(){
        return (
            <Table.Row disabled={this.props.request.completed}>
                <Table.Cell>{this.props.index}</Table.Cell>
                <Table.Cell>{this.props.request.description}</Table.Cell>
                <Table.Cell>{web3.utils.fromWei(this.props.request.value,'ether')}</Table.Cell>
                <Table.Cell>{this.props.request.recipient}</Table.Cell>
                <Table.Cell>{this.props.request.approvalCount}/{this.props.approvers}</Table.Cell>
                <Table.Cell><Button onClick={this.callingFunction.bind(this)}>Approve</Button></Table.Cell>
                <Table.Cell><Button onClick={this.anotherOne.bind(this)}>Finalize</Button></Table.Cell>
            </Table.Row>
        )
    }
}

export default RequestRow;