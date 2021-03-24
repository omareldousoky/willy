import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import * as local from '../../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../../Shared/Components/Loader';
import { financialClosing } from '../../../Services/APIs/loanApplication/financialClosing';
import Swal from 'sweetalert2';
import { Col, Form, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getErrorMessage } from '../../../../Shared/Services/utils';
import { withRouter } from 'react-router-dom';
import Can from '../../../config/Can';


interface Props {
    history: Array<string>;
}
interface State {
    loading: boolean;
}

const today: Date = new Date();

const bulkClosingValidation = Yup.object().shape({
    closeDate: Yup.string().test('close date cant be in the future', local.dateCantBeInFuture, (value: string) => {
        return value ? new Date(value).valueOf() <= today.valueOf() : true;
    })
})
class BulkClosing extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    async Close(closeDate: number) {
        this.setState({ loading: true })
        const res = await financialClosing({ closeDate })
        if (res.status == "success") {
            this.setState({ loading: false })
            Swal.fire('Success', '', 'success').then(()=> this.props.history.push('/'));
        } else {
            this.setState({ loading: false })
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
        }
    }
    handleSubmit = async (values) => {
        const closeDate = values.closeDate;
        const endOfCloseDate = new Date(closeDate).setHours(23, 59, 59,999).valueOf();
        Swal.fire({
            title: local.areYouSure,
            text: `${local.bulkClosing}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.bulkClosing,
            cancelButtonText: local.cancel
        }).then(async (isConfirm) => {
            if (isConfirm.value) {
                await this.Close(endOfCloseDate);
            }
        });
    }
    render() {
        return (
            <Card className="main-card">
                <Loader type="fullscreen" open={this.state.loading} />
                <div className="custom-card-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.bulkClosing}</Card.Title>
                    </div>
                </div>
                <Card.Body className="w-100 d-flex justify-content-center">
                    <Formik
                        initialValues={{ closeDate: 0 }}
                        onSubmit={this.handleSubmit}
                        validationSchema={bulkClosingValidation}
                        validateOnBlur
                        validateOnChange
                    >
                        {(formikProps) =>
                            <Form onSubmit={formikProps.handleSubmit} className="w-50 p-3">
                                <Col sm={12} key={"colseDate"}>
                                    <Form.Group controlId="closeDate">
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
                                                {local.closeDate}
                                            </p>
                                            <Form.Control
                                                style={{ marginLeft: 20, border: "none" }}
                                                type="date"
                                                name="closeDate"
                                                data-qc="closeDate"
                                                value={formikProps.values.closeDate}
                                                isInvalid={Boolean(
                                                    formikProps.errors.closeDate &&
                                                    formikProps.touched.closeDate
                                                )}
                                                onBlur={formikProps.handleBlur}
                                                onChange={(e) => {
                                                    formikProps.setFieldValue(
                                                        "closeDate",
                                                        e.currentTarget.value
                                                    );
                                                    if (e.currentTarget.value === "")
                                                        formikProps.setFieldValue(
                                                            "closeDate",
                                                            ""
                                                        );
                                                }}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formikProps.errors.closeDate}
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
                                <Can I="financialClosing" a="application"><Button  className="w-25"  type="submit" variant="primary">
                                    {local.submit}
                                </Button></Can>
                                </div>
                            </Form>
                        }
                    </Formik>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex">
                        <p className="clickable-action" onClick={() => this.props.history.push('/reports')}>{local.reviewFinancialState}</p>
                    </div>
                </Card.Footer>
            </Card>
        )
    }
}
export default withRouter(BulkClosing);