import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import Select from 'react-select';
import * as local from '../../../Shared/Assets/ar.json';
import { ClearanceValues, ClearanceErrors, ClearanceTouched } from './clearanceFormIntialState';
import ReceiptPhoto from './receiptPhoto';


interface Props {
    values: ClearanceValues;
    errors: ClearanceErrors;
    touched: ClearanceTouched;
    edit: boolean;
    customerKey: string;
    handleChange: (eventOrPath: string | React.ChangeEvent<any>) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
    handleBlur: (eventOrString: any) => void | ((e: any) => void);
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    cancel: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any;
}

export const CreateClearanceForm = (props: Props) => {
    const handlePhotoChange = (imageURL) =>{
       
        props.setFieldValue('receiptPhoto',imageURL);
         
    
    };

    return (
        <div style={{ padding: '2rem 30px' }}>
            <Form 
            className={"clearance-form"}
            onSubmit={props.handleSubmit}
            >
                <Row className={"clearance-row"}>
                    <Form.Group as={Col} controlId='applicationKey'>
                        <Form.Label className={"clearance-label"}>{local.financeCode}</Form.Label>
                        <Select />
                    </Form.Group>
                    <Form.Group as={Col} controlId='customerKey'>
                        <Form.Label className={"clearance-label"}>{local.customerCode}</Form.Label>
                        <Form.Control
                            type={'text'}
                            name={'customerKey'}
                            data-qc={'customerKey'}
                            value={props.customerKey}
                            disabled />
                    </Form.Group>
                </Row>

                <Row className={"clearance-row"}>
                    <Form.Group as={Col} controlId='registrationDate'>
                        <Form.Label className={"clearance-label"} >{local.registrationDate}</Form.Label>
                        <Form.Control
                            type={"date"}
                            name={"registrationDate"}
                            data-qc={"registrationDate"}
                            value={props.values.registrationDate as string}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.registrationDate && props.touched.registrationDate) as boolean}
                        />
                        <Form.Control.Feedback type={"invalid"}>
                            {props.errors.registrationDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId='receiptDate'>
                        <Form.Label className={"clearance-label"} >{local.receiptDate}</Form.Label>
                        <Form.Control
                            type={"date"}
                            name={"receiptDate"}
                            data-qc={"receiptDate"}
                            value={props.values.receiptDate as string}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.receiptDate && props.touched.receiptDate) as boolean}
                        />
                        <Form.Control.Feedback type={"invalid"}>
                            {props.errors.receiptDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

            <Row className={"clearance-row"}>
                <Form.Group as={Col} controlId='transactionKey'>
                    <Form.Label className={"clearance-label"} >{local.transactionKey}</Form.Label>
                    <Form.Control
                        type={'text'}
                        name={"transactionKey"}
                        data-qc={"transactionKey"}
                        value={props.values.transactionKey}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={(props.errors.transactionKey && props.touched.transactionKey) as boolean}
                        disabled={(props.values.manualReceipt ? true : false) as boolean}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        {props.errors.transactionKey}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId='manualReceipt'>
                    <Form.Label className={"clearance-label"} >{local.manualReceipt}</Form.Label>
                    <Form.Control
                        type={"text"}
                        name={"manualReceipt"}
                        data-qc={"manualReceipt"}
                        value={props.values.manualReceipt}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={(props.errors.manualReceipt && props.touched.manualReceipt) as boolean}
                        disabled = {(props.values.transactionKey ?  true :false)as boolean}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        {props.errors.manualReceipt}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className={"clearance-row"}>
                <Form.Group as={Col} controlId='clearanceReason'>
                    <Form.Label className={"clearance-label"} >{local.clearanceReason} </Form.Label>
                    <Form.Control
                        type={'text'}
                        name={"clearanceReason"}
                        data-qc={"clearanceReason"}
                        value={props.values.clearanceReason}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={(props.errors.clearanceReason && props.touched.clearanceReason) as boolean}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        {props.errors.clearanceReason}
                    </Form.Control.Feedback>
                    </Form.Group>
                <Form.Group as={Col} controlId='bankName'>
                    <Form.Label className={"clearance-label"} >{local.bankName}</Form.Label>
                    <Form.Control
                        type='text'
                        name={"bankName"}
                        data-qc={"bankName"}
                        value={props.values.bankName}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={(props.errors.bankName && props.touched.bankName) as boolean}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        {props.errors.bankName}
                    </Form.Control.Feedback>
                    </Form.Group>
            </Row>
            <Row className={"clearance-row"}>
                <Form.Group as={Col} controlId='comments'>
                    <Form.Label className={"clearance-label"} >{local.comments}</Form.Label>
                    <Form.Control
                        type='text'
                        name={"comments"}
                        data-qc={"comments"}
                        value={props.values.notes}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={(props.errors.notes && props.touched.notes) as boolean}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        {props.errors.notes}
                    </Form.Control.Feedback>
                    </Form.Group>
            </Row>
            <Row className={"clearance-row"}>
                <Form.Label className={"clearance-label"}>{local.receiptPhoto}</Form.Label>
                <ReceiptPhoto
                data-qc='receiptPhoto'
                photoObject= {{
                    receiptPhotoURL: props.values.receiptPhotoURL,
                    receiptPhoto: props.values.receiptDate,
                }}
                handlePhotoChange ={handlePhotoChange}
                 />
            </Row>
            <Form.Group
                as={Row}
            >
                <Col >
                    <Button
                        className={'btn-cancel-prev'} style={{ width: '60%' }}
                        onClick={() => { props.cancel() }}
                    >{local.cancel}</Button>
                </Col>
                <Col>
                    <Button className={'btn-submit-next'} style={{ float: 'left', width: '60%' }} type="submit" data-qc="next">{local.registerClearance}</Button>
                </Col>
            </Form.Group>
            </Form>
        </div >
    )
}
