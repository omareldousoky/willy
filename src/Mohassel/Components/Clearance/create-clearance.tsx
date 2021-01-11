import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CustomerBasicsCard from './basicInfoCustomer'
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { CreateClearanceForm } from './createClearanceForm';
import { Card } from 'react-bootstrap';
interface Props {
    history: Array<string | { id: string }>;
    location: {
      state: {
        id: string;
      };
    };
}
interface State {
    customer: {
        key: string;
        branchName: string;
        customerName: string;
    };
}
 class CreateClearance extends Component <Props , State> {
    constructor(props: Props){
        super(props);
        this.state = {
            customer: {
                key: '',
                branchName: '',
                customerName: '',            }
        }
    } 

     componentDidMount() {
            this.getCustomer();
     }

     async getCustomer(){
       const res =  await getCustomerByID(this.props.location.state.id);
       if(res.status === 'success'){
           this.setState({
            customer: {
                key: res.body.key,
                branchName: res.body.branchName,
                customerName: res.body.customerName
            }
           })
       }
    }
    render() {
        return (
            <Card>
                <Card.Title>
                <CustomerBasicsCard 
                customerKey ={this.state.customer.key}
                branchName = {this.state.customer.branchName}
                customerName= {this.state.customer.customerName}
                />
                </Card.Title>
                <Card.Body>
                <CreateClearanceForm />
                </Card.Body>
            </Card>
        )
    }
}

export default withRouter(CreateClearance);
 