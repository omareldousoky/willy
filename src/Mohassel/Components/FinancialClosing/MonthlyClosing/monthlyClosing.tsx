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
interface State {
    loading: boolean;
}

const endOfDay: Date = new Date();

const monthClosingValidation = Yup.object().shape({
 closeDate : Yup.string().test('close date cant be in the future',local.dateCantBeInFuture,(value: string)=>{
    return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true;
 })
})
class MonthlyClosing extends Component<{}, State>{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

        }
    }
    async Close(closeDate: number) {
        const res = await financialClosing({ closeDate })
        if (res.status == "success") {
            Swal.fire('Success', '', 'success');
        }
    }
    async handleSubmit(values) {
        const closeDate = values.closeDate;
        console.log(new Date(closeDate).valueOf());
    }
    render() {
        return (
            <>
                <div className={'rowContainer'}>
                    <BackButton title={local.monthlyClosing} />
                </div>
                <Card style={{ margin: '20px 50px' }} className="print-none">
                    <Loader type="fullscreen" open={this.state.loading} />
                    <Card.Body style={{ padding: 15, display: 'flex', justifyContent: 'center' }}>
                        <Formik
                            initialValues={{ closeDate: 0 }}
                            onSubmit={this.handleSubmit}
                            validationSchema={monthClosingValidation}
                            validateOnBlur
                            validateOnChange
                        >
                            {(formikProps) =>
                                <Form onSubmit={formikProps.handleSubmit}>
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
                                                    {local.date}
                                                </p>
                                                <span>{local.from}</span>
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
                </Card>
            </>
        )
    }
}
export default MonthlyClosing;