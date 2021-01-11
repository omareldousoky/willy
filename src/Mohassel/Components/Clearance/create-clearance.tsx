import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CustomerBasicsCard from './basicInfoCustomer'
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { CreateClearanceForm } from './createClearanceForm';
import { Card } from 'react-bootstrap';
import { Formik } from 'formik';
import { clearanceCreationValidation, clearanceData, ClearanceValues } from './clearanceFormIntialState';
import { step1 } from '../CustomerCreation/customerFormIntialState';
interface Props {
    history: any;
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
    step: number;
    step1: ClearanceValues;
}
class CreateClearance extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            customer: {
                key: '',
                branchName: '',
                customerName: '',
            },
            step: 1,
            step1: clearanceData,
        }
    }

    componentDidMount() {
        this.getCustomer();
    }

    async getCustomer() {
        const res = await getCustomerByID(this.props.location.state.id);
        if (res.status === 'success') {
            this.setState({
                customer: {
                    key: res.body.key,
                    branchName: res.body.branchName,
                    customerName: res.body.customerName
                }
            })
        }
    }
    cancel(){
        this.setState({
            step:1,
            step1: clearanceData,
        });
        this.props.history.goBack();

    }
    submit= (values) =>{
        console.log(values);
    }
    render() {
        return (
            <Card>
                <Card.Title>
                    <CustomerBasicsCard
                        customerKey={this.state.customer.key}
                        branchName={this.state.customer.branchName}
                        customerName={this.state.customer.customerName}
                    />
                </Card.Title>
                <Card.Body>
                    <Formik
                        enableReinitialize
                        initialValues={this.state.step1}
                        validationSchema={clearanceCreationValidation}
                        onSubmit={this.submit}
                        validateOnChange
                        validateOnBlur
                    >
                        {(formikProps) =>
                            <CreateClearanceForm   {...formikProps} cancel={() => this.cancel()} edit={false} customerKey={this.state.customer.key} />
                        }
                    </Formik>
                </Card.Body>
            </Card>
        )
    }
}

export default withRouter(CreateClearance);
