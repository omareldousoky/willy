import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as local from '../../../Shared/Assets/ar.json';
import Button from 'react-bootstrap/Button';
import { DocumentType } from '../../Services/interfaces';

interface Props {
    values: DocumentType;
    edit: boolean;
    cancel: any;
    handleChange: any;
    handleBlur: any;
    setFieldValue: any;
    handleSubmit: any;
    errors: any;
    touched: any;
}
const DocumentTypeCreationForm = (props: Props) => {
    const [yesState, setYes] = useState(true);
    const [noState, setNo] = useState(false);


    return (
        <Form style={{ padding: "10px 50px", textAlign: "right" }} onSubmit={props.handleSubmit}>
            <Row style={{ marginTop: '2rem' }}>
                <Col>
                    <Form.Group className="data-group" controlId="name" >
                        <Form.Label className="data-label">{`${local.documentName} *`}</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={props.values.name}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.name && props.touched.name) as boolean}
                            disabled={props.edit}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="data-group" controlId="type">
                        <Form.Label className="data-label">{`${local.documentFor} *`}</Form.Label>
                        <Form.Control as="select"
                            name="type"
                            value={props.values.type}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.type && props.touched.type) as boolean}
                        >
                            <option value="" disabled></option>
                            <option value="customer">{local.customer}</option>
                            <option value="loanApplication">{local.loanApplicationId}</option>
                            <option value="issuedLoan">{local.issuedLoan}</option>
                        </Form.Control>
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.type}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row style={{ marginTop: '2rem' }}>
                <Col >
                    <Form.Group className="data-group" controlId="pages">
                        <Form.Label className="data-label">{`${local.numOfDocuments} *`}</Form.Label>
                        <Form.Control
                            type="number"
                            name="pages"
                            value={props.values.pages}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={(props.errors.pages && props.touched.pages) as boolean}
                            disabled={props.edit}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            {props.errors.pages}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group
                        controlId="updatable"
                        className={'data-group'}
                    >
                        <Form.Label
                            className={'data-label'}
                        >{local.allowUpdate}</Form.Label>
                        <Row style={{ margin: 0 }}>
                            <Form.Check
                                type={'radio'}
                                value={1}
                                checked={yesState}
                                label={local.yes}
                                onChange={() => {
                                    setYes(true);
                                    setNo(false)
                                    props.setFieldValue('updatable', true);
                                }}

                            />
                            <Form.Check
                                type={'radio'}
                                checked={noState}
                                value={0}
                                label={local.no}
                                onChange={() => {
                                    setYes(false);
                                    setNo(true)
                                    props.setFieldValue('updatable', false);
                                }}
                            />
                        </Row>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group
                as={Row}
                className="data-group"
                style={{ marginTop: "4rem" }}
            >
                <Col>
                    <Button
                        className={'btn-cancel-prev'} style={{ width: '60%' }}
                        onClick={() => { props.cancel() }}
                    >{local.cancel}</Button>
                </Col>
                <Col>
                    <Button className={'btn-submit-next'} style={{ float: 'left', width: '60%' }} type="submit" data-qc="submit">{local.submit}</Button>
                </Col>
            </Form.Group>
        </Form>
    )
}

export default DocumentTypeCreationForm;
