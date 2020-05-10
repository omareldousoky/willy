import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import BackButton from '../BackButton/back-button'
import * as local from '../../../Shared/Assets/ar.json'
import Card from 'react-bootstrap/Card';
import './userDetails.scss';
import UserDetailsView from './userDetailsView';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { getUserDetails } from '../../Services/APIs/Users/userDetails';
import { UserDateValues } from './userDetailsInterfaces';
import Swal from 'sweetalert2';
import { Loader } from '../../../Shared/Components/Loader';
import { theme } from '../../../theme';
import UserRolesView from './userRolesView';
import { setUserActivation } from '../../Services/APIs/Users/userActivation';
interface Props {
    history: any;
}
interface State {
    step: number;
    isLoading: boolean;
    data: UserDateValues;
}
class UserDetails extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            step: 1,
            isLoading: false,
            data: {
                updated: { by: '', at: 0 },
                created: { by: '', at: 0 },
                username: '',
                name: '',
                nationalId: '',
                nationalIdIssueDate: 0,
                gender: '',
                birthDate: 0,
                branches: [''],
                roles: [''],
                _id: '',
                hiringDate: 0,
                hrCode: '',
                mobilePhoneNumber: '',
                status: '',

            },
        }
    }
    async handleActivationClick(){
        const id =  this.props.history.location.state.details;
        const req= {id, status: this.state.data.status ==="active"?"inactive" :"active"}
        this.setState({isLoading:true});
    
        const res = await setUserActivation(req);
         if(res.status==='success'){
           await this.getUserDetails();
           Swal.fire("success",`${this.state.data.username} is ${req.status} now`)
      
         } else {
          this.setState({isLoading:false})
           Swal.fire("error");
         }
    
      }
    setUserDetails(data: any): UserDateValues {
        const user: UserDateValues = data.user;
        user.branches = data.branches?.map((branch) => { return branch.name });
        user.roles =  data.roles?.map((role) => { return role.roleName });
        return user;
    }
    async  getUserDetails (){
        const _id = this.props.history.location.state.details;
        this.setState({ isLoading: true });
        const res = await getUserDetails(_id);
        const user = this.setUserDetails(res.body);
        if (res.status === "success") {
            this.setState({
                data: user,
                isLoading: false,
            })
        } else {
            this.setState({ isLoading: false });
            Swal.fire("erroe", local.userDetialsError);
        }
    }
    async  componentDidMount() {
        await this.getUserDetails();
       
      
    }
    renderICons() {
        const id = this.props.history.location.state.details;
        return (
            <div className={'rowContainer'}>
                <div
                    className={'iconConatiner'}
                    onClick={() => { this.props.history.push({pathname:"/edit-user",state: { details: id }}) }}
                >
                    <img className={'iconImage'} alt={"edit"} src={require('../../Assets/editIcon.svg')} />
                    {local.edit}</div>
                <div
                onClick = {async ()=>this.handleActivationClick()}
                     className={'iconConatiner'}>
                   {this.state.data.status ==="active" && <img className={'iconImage'} alt={"deactive"} src={require('../../Assets/deactivate-user.svg')} />}
                    {this.state.data.status ==="active" ? local.deactivate : local.activate}</div>
            </div>
        );
    }
    renderTabs(): any {
        switch (this.state.step) {
            case 1:
                return (<UserDetailsView data={this.state.data} />);
            case 2:
                return(<UserRolesView hasBranch={this.state.data.branches?.length?true:false} roles ={this.state.data.roles} />);
            default:
                return null;
        }
    }
    render() {
        return (
            <>
                <div className={'rowContainer'}>
                    <BackButton title={local.userDetails} />
                    {this.renderICons()}
                </div>
                <Card className='card'>
                    <Loader type="fullsection" open={this.state.isLoading} />
                    <Tabs activeKey={this.state.step} id="user-tab-details" style={{ marginBottom: 20, }} onSelect={(key: string) => this.setState({ step: Number(key) })} >
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

export default withRouter(UserDetails);
