import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Select from 'react-select';
import * as local from '../../../Shared/Assets/ar.json';
import ReceiptPhoto from './receiptPhoto';

interface Values {
    registrationDate: number | string;
    receiptDate: number | string;
}
interface Errors {
    registrationDate?: string;
    receiptDate?: string;
}
interface Touched {
    registrationDate?: boolean;
    receiptDate?: boolean;
}
interface Props {
    values: Values;
    errors: Errors;
    touched: Touched;
    edit: boolean;
    _id: string;

    handleChange: (eventOrPath: string | React.ChangeEvent<any>) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
    handleBlur: (eventOrString: any) => void | ((e: any) => void);
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    cancel: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    setFieldValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => any;
}
export const CreateClearanceForm = (props: any) => {
    return (
        <Container>
            <Form className={"clearance-form"}>
                <Row>
                    <Form.Group as={Col} controlId='applicationKey'>
                        <Form.Label className={"clearance-label"} >{local.financeCode}</Form.Label>
                        <Select />
                    </Form.Group>
                    <Form.Group as={Col} controlId='customerKey'>
                        <Form.Label className={"clearance-label"} >{local.customerCode}</Form.Label>
                        <Form.Control disabled />
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group as={Col} controlId='registrationDate'>
                        <Form.Label className={"clearance-label"} ></Form.Label>
                        <Form.Control
                            type={"date"}
                            name={"registrationDate"}
                            data-qc={"registrationDate"}
                        // value={props.values.registrationDate as string}
                        // onChange={props.handleChange}
                        // onBlur={props.handleBlur}
                        // isInvalid={(props.errors.registrationDate && props.touched.registrationDate) as boolean}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId='receiptDate'>
                        <Form.Label className={"clearance-label"} >{local.receiptDate}</Form.Label>
                        <Form.Control
                            type={"date"}
                            name={"receiptDate"}
                            data-qc={"receiptDate"}
                        // value={props.values.receiptDate as string}
                        // onChange={props.handleChange}
                        // onBlur={props.handleBlur}
                        // isInvalid={(props.errors.receiptDate && props.touched.receiptDate) as boolean}
                        />
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group as={Col} controlId='transactionKey'>
                        <Form.Label className={"clearance-label"} >{local.transactionKey}</Form.Label>
                        <Form.Control
                            type={'text'}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId='manualReceipt'>
                        <Form.Label className={"clearance-label"} >{local.manualReceipt}</Form.Label>
                        <Form.Control
                            type={"text"}
                        />
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group as={Col} controlId='clearanceReason'>
                        <Form.Label className={"clearance-label"} >{local.clearanceReason} </Form.Label>
                        <Form.Control
                            type={'text'}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId='bankName'>
                        <Form.Label className={"clearance-label"} >{local.bankName}</Form.Label>
                        <Form.Control
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} controlId='comments'>
                        <Form.Label className={"clearance-label"} >{local.comments}</Form.Label>
                        <Form.Control
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <ReceiptPhoto />
                </Row>
            </Form>
        </Container>
    )
}
