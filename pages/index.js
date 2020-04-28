import React,{Component} from 'react'
import instance from '../ethereum/factory' 
import ContributionForm from '../Components/ContributeForm'
import { Card , Button } from 'semantic-ui-react'
import Layout from '../Components/Layout'
import {Link} from '../routes'

class CampaignIndex extends Component{

    constructor(props){
        super(props);
    }

    static async getInitialProps(){
        let campaigns = await instance.methods.getDeployedCampaign().call();
        return { campaigns };
    }

    ButtonExampleLabeledIconShorthand(){
        return (
          <Link route='/campaigns/new'>
              <a>  
                <Button floated='right' content='Create Campaign' icon='plus circle' primary />
            </a>
          </Link>
      )
    }

    renderCampaigns(){
        const items = this.props.campaigns.map((campaign)=>{
            return {
                header: campaign,
                description: <Link route={`campaigns/${campaign}`}><a>View Campaign</a></Link>,
                fluid: true
            }
        })
        return <Card.Group items={items} />
    }

    render(){
        console.log('checkpoint')
        return (
        <Layout>
        <div>
        <h3>Open Campaigns</h3>
        {this.ButtonExampleLabeledIconShorthand()}
        {this.renderCampaigns()}
        
        </div>
        </Layout>
        )
    }
}

// let a = new CampaignIndex(CampaignIndex.getInitialProps());
// console.log('hello',a);
// console.log(a.render());

export default CampaignIndex;