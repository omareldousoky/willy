import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import BackButton from '../BackButton/back-button'
import * as local from '../../../Shared/Assets/ar.json'
import Card from 'react-bootstrap/Card';
import './userDetails.scss';
import UserDetailsView from './userDetailsView';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
interface Props {
  history: any;
}
interface State {
    step: number;
}
 class UserDetails extends Component <Props,State> {
    constructor(props: Props){
        super(props);
       this.state = {
           step:1,
       }
     
    }
    renderTabs(): any {
        switch (this.state.step) {
            case 1:
               return(<UserDetailsView  data={this.props.history.location.state.details}/>);
            
        
            default:
                return null;
        }
    }
    render() {
        console.log(this.props.history.location.state.details);
        return (
            <>
                <BackButton title={local.userDetails} />
                <Card className='card'>
                    <Tabs activeKey={this.state.step} id="user-tab-details" style={{ marginBottom: 20, }} onSelect={(key: string) => this.setState({ step: Number(key) }) } >
                        <Tab eventKey={1} title={local.userBasicData}></Tab>
                        <Tab eventKey={2} title={local.userRoles}></Tab>
                    </Tabs>
                    <Card.Body>
                        {this.renderTabs()}
                    </Card.Body>
                </Card>
                
            </>
        )
    }
}

export default  withRouter(UserDetails);
