import React,{Component} from 'react'
import campaignCreater from '../../ethereum/campaign'
import Layout from '../../Components/Layout'
import web3 from '../../ethereum/web3'
import {Card , Grid, GridColumn, Button, GridRow} from 'semantic-ui-react'
import ContributionForm from '../../Components/ContributeForm'
import {Link} from '../../routes'

class Campaign extends Component{

    static async getInitialProps(props){
        const campaign = campaignCreater(props.query.address)
        // console.log(campaign)
        const details = await campaign.methods.getSummary().call()
        // console.log(details);
        return {
            address: props.query.address,
            minimumContribution: details[0],
            balance: details[1],
            requestsCount: details[2],
            approvarsCount: details[3],
            manager: details[4]
        }
    }

    render(){

        const {minimumContribution,balance,requestsCount,approvarsCount,manager} = this.props

        const items=[
            {
                header: manager,
                meta: 'address of manager',
                description: 'this is the creator of campaign',
                style:{wordWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'minimum contribution',
                description: 'You have to donate minimum this much amount to become approver'
            },
            {
                header: web3.utils.fromWei(balance,'ether'),
                meta: 'contract balance()ether',
                description: 'This much amount is left in contract to spend'
            },
            {
                header: requestsCount,
                meta: 'Total requests',
                description: 'these are spending requests by manager'
            },
            {
                header: approvarsCount,
                meta: 'approvers',
                description: 'this many peoples have donated in this contract and are valid approvers'
            }
        ]

        return (
            <Layout>
                <Grid>
                    <GridRow>
                        <GridColumn width={10}>
                            <Card.Group items={items} />
                        </GridColumn>
                        <GridColumn width={6}>
                            <ContributionForm address={this.props.address}></ContributionForm>
                        </GridColumn>
                    </GridRow>
                    <GridRow>
                        <GridColumn>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View reuests</Button>
                                </a>
                            </Link>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </Layout>
        )
    }
}

export default Campaign;