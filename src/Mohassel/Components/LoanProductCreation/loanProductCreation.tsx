import React, { Component } from 'react';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import { LoanProduct, LoanProductValidation } from './loanProductStates';
import { LoanProductCreationForm } from './loanProductCreationForm';
import { createProduct } from '../../Services/APIs/loanProduct/createProduct';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
    title: string;
    history: Array<string>;

};
interface State {
    product: object;
    loading: boolean;
}

class LoanProductCreation extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            product: LoanProduct,
            loading: false

        }
    }
    async submit(values: object) {
        const obj = values
        const res = await createProduct(obj);
        if (res.status === 'success') {
            this.setState({ loading: false });
            Swal.fire("success", local.loanProductCreated).then(() => { this.props.history.push("/") })
        } else {
            Swal.fire("error", local.loanProductCreationError)
            this.setState({ loading: false });
        }
    }
    render() {
        return (
            <div>
                {this.state.loading ? <Spinner animation="border" className="central-loader-fullscreen" /> :
                    <Container>
                        <Formik
                            enableReinitialize
                            initialValues={this.state.product}
                            onSubmit={this.submit}
                            validationSchema={LoanProductValidation}
                            validateOnBlur
                            validateOnChange
                        >
                            {(formikProps) =>
                                <LoanProductCreationForm {...formikProps} />
                            }
                        </Formik>
                    </Container>
                }
            </div>
        )
    }
}
export default LoanProductCreation;