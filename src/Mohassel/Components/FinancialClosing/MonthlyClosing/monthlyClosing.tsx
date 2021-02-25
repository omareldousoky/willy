import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import * as local from '../../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import { Loader } from '../../../../Shared/Components/Loader';
import { financialClosing } from '../../../Services/APIs/loanApplication/financialClosing';
import Swal from 'sweetalert2';
import { Col, Form, } from 'react-bootstrap';
import BackButton from '../../BackButton/back-button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getErrorMessage } from '../../../../Shared/Services/utils';
import { withRouter } from 'react-router-dom';

interface Props {
    history: Array<string>;
}
interface State {
    loading: boolean;
}

const today: Date = new Date();

const monthClosingValidation = Yup.object().shape({
    closeDate: Yup.string().test('close date cant be in the future', local.dateCantBeInFuture, (value: string) => {
        return value ? new Date(value).valueOf() <= today.valueOf() : true;
    })
})
class MonthlyClosing extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    async Close(closeDate: number) {
        this.setState({ loading: true })
        console.log(closeDate)
        const res = await financialClosing({ closeDate })
        if (res.status == "success") {
            this.setState({ loading: false })
            Swal.fire('Success', '', 'success');
        } else {
            this.setState({ loading: false })
            Swal.fire('Error !', getErrorMessage(res.error.error), 'error');
        }
    }
     handleSubmit = async(values) =>{
        const closeDate = values.closeDate;
        const endOfCloseDate = new Date(closeDate).setHours(23, 59, 59).valueOf();
        console.log(endOfCloseDate);
        Swal.fire({
            title: local.areYouSure,
            text: `${local.monthlyClosing}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.monthlyClosing,
            cancelButtonText: local.cancel
        }).then(async (isConfirm) => {
                if (isConfirm.value) {
                    await this.Close(endOfCloseDate);
                }
            });
    }
    render() {
        return (
            <>
                <div className={'rowContainer'}>
                    <BackButton title={local.monthlyClosing} />
                </div>
                <Card className="main-card">
                    <Loader type="fullscreen" open={this.state.loading} />
                    <Card.Body className=" d-flex justify-content-center">
                        <Formik
                            initialValues={{ closeDate: 0 }}
                            onSubmit={this.handleSubmit}
                            validationSchema={monthClosingValidation}
                            validateOnBlur
                            validateOnChange
                        >
                            {(formikProps) =>
                                <Form onSubmit={formikProps.handleSubmit} className="w-50">
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
                                    <Button
                                        style={{ float: 'right' }}
                                        variant="secondary"
                                        onClick={() => {
                                            window.location.reload();
                                        }}
                                    >
                                        {local.cancel}
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        {local.submit}
                                    </Button>
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
            </>
        )
    }
}
export default withRouter(MonthlyClosing);