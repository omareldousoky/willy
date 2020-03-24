import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner';
import * as local from '../../../Shared/Assets/ar.json';
import { LoanApplicationCreationForm } from './loanApplicationCreationForm';
import { LoanApplication, LoanApplicationValidation } from './loanApplicationStates';
import { getBranches } from '../../Services/APIs/Branch/getBranches';
interface Props {
    title: string;
    history: Array<string>;

};
interface State {
    application: object;
    loading: boolean;
}
class LoanApplicationCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            application: LoanApplication,
            loading: false
        }
    }
    async UNSAFE_componentWillMount(){
        const branches = await getBranches();
        if(branches.status === 'success'){
            console.log(branches)
        } else {
            console.log('err')
        }
    }
    submit = async(values: object) => {
        this.setState({ loading: true });
    }
    render() {
        return (
            <div>
                {this.state.loading ? <Spinner animation="border" className="central-loader-fullscreen" /> :
                    <Container>
                        <Formik
                            enableReinitialize
                            initialValues={this.state.application}
                            onSubmit={this.submit}
                            validationSchema={LoanApplicationValidation}
                            validateOnBlur
                            validateOnChange
                        >
                            {(formikProps) =>
                                <LoanApplicationCreationForm {...formikProps} />
                            }
                        </Formik>
                    </Container>
                }
            </div>
        )
    }
}
export default LoanApplicationCreation;