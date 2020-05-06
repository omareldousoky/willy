import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import BackButton from '../BackButton/back-button'
import * as local from '../../../Shared/Assets/ar.json'
import Card from 'react-bootstrap/Card';
import './userDetails.scss';
import UserDetailsView from './userDetailsView';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { getUserDetails } from '../../Services/APIs/Users/userDetails';
import { UserDateValues } from './userDetailsInterfaces';
interface Props {
  history: any;
}
interface State {
    step: number;
    isLoading: boolean;
    data: UserDateValues;
}
 class UserDetails extends Component <Props,State> {
    constructor(props: Props){
        super(props);
       this.state = {
           step:1,
           isLoading: false,
           data: {
               updated:{by: '',at:0},
               created:{by:'',at:0},
               username: '',
               name: '',
               nationalId:'',
               nationalIdIssueDate: 0,
               gender: '',
               birthDate:0,
               branches:[''],
               roles:[''],
               _id:'',
               hiringDate:0,
               hrCode:'',
               mobilePhoneNumber:'',
               status: '',
               
           },
       }
    }
    setUserDetails(data: any): UserDateValues{
      const user: UserDateValues =data.user;
                user.branches= data.branches?.map((branch)=> {return branch.name});
                user.roles =  data.roles.map((role)=> {return role.roleName});
     return user;
    }
  async  componentDidMount(){
        const _id= this.props.history.location.state.details;
        console.log(_id);
      const res = await getUserDetails(_id) ;
      const user = this.setUserDetails(res.body);
       if(res.status==="success"){
           this.setState({
               data: user,
           })
       }
    }
    renderTabs(): any {
        switch (this.state.step) {
            case 1:
               return(<UserDetailsView  data={this.state.data}/>);
            
        
            default:
                return null;
        }
    }
    render() {
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
