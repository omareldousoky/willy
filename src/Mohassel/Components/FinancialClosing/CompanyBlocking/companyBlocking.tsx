import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import * as local from '../../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../../Shared/Components/Loader';
import { financialBlocking } from '../../../Services/APIs/loanApplication/financialClosing';
import Swal from 'sweetalert2';
import { Col, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getErrorMessage } from '../../../../Shared/Services/utils';
import { RouteComponentProps, withRouter } from 'react-router-dom';


interface Props extends RouteComponentProps {
    history: any;
}
interface State {
    loading: boolean;
}

const today: Date = new Date();

const companyBlockingValidation = Yup.object().shape({
    blockDate: Yup.string().test('block date cant be in the future', local.dateCantBeInFuture, (value: string) => {
        return value ? new Date(value).valueOf() <= today.valueOf() : true;
    })
})
class CompanyBlocking extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    async Block(blockDate: number) {
        this.setState({ loading: true })
        const res = await financialBlocking({ blockDate })
        if (res.status === "success") {
            this.setState({ loading: false })
            Swal.fire('Success', '', 'success').then(()=> this.props.history.push('/'));
        } else {
            this.setState({ loading: false })
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
        }
    }
    handleSubmit = async (values) => {
        const blockDate = values.blockDate;
        const endOfBlockDate = new Date(blockDate).setHours(23, 59, 59,999).valueOf();
        Swal.fire({
            title: local.areYouSure,
            text: `${local.companyBlocking}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.companyBlocking,
            cancelButtonText: local.cancel
        }).then(async (isConfirm) => {
            if (isConfirm.value) {
                await this.Block(endOfBlockDate);
            }
        });
    }
    render() {
        return (
            <Card className="main-card">
                <Loader type="fullscreen" open={this.state.loading} />
                <div className="custom-card-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.companyBlocking}</Card.Title>
                    </div>
                </div>
                <Card.Body className="w-100 d-flex justify-content-center">
                    <Formik
                        initialValues={{ blockDate: 0 }}
                        onSubmit={this.handleSubmit}
                        validationSchema={companyBlockingValidation}
                        validateOnBlur
                        validateOnChange
                    >
                        {(formikProps) =>
                            <Form onSubmit={formikProps.handleSubmit} className="w-50 p-3">
                                <Col sm={12} key={"colseDate"}>
                                    <Form.Group controlId="blockDate">
                                        <div
                                            className="dropdown-container"
                                            style={{ flex: 1, alignItems: "center" }}
                                        >
                                            <p
                                                className="dropdown-label"
                                                style={{
                                                    alignSelf: "normal",
                                                    marginLeft: 20,
                                                    width: 300,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {local.blockDate}
                                            </p>
                                            <Form.Control
                                                style={{ marginLeft: 20, border: "none" }}
                                                type="date"
                                                name="blockDate"
                                                data-qc="blockDate"
                                                value={formikProps.values.blockDate}
                                                isInvalid={Boolean(
                                                    formikProps.errors.blockDate &&
                                                    formikProps.touched.blockDate
                                                )}
                                                onBlur={formikProps.handleBlur}
                                                onChange={(e) => {
                                                    formikProps.setFieldValue(
                                                        "blockDate",
                                                        e.currentTarget.value
                                                    );
                                                    if (e.currentTarget.value ==="")
                                                        formikProps.setFieldValue(
                                                            "blockDate",
                                                            ""
                                                        );
                                                }}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formikProps.errors.blockDate}
                                            </Form.Control.Feedback>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <div className="d-flex justify-content-between py-4">
                                <Button
                                    className="w-25"            
                                    variant="secondary"
                                    onClick={() => {
                                        window.location.reload();
                                    }}
                                >
                                    {local.cancel}
                                </Button>
                                {/* TODO : ADD <Can I="" a =""></Can> */}
                                <Button  className="w-25"  type="submit" variant="primary"> 
                                    {local.submit}
                                </Button>
                                </div>
                            </Form>
                        }
                    </Formik>
                </Card.Body>
            </Card>
        )
    }
}
export default withRouter(CompanyBlocking);