import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import Select from 'react-select';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
export const AssignProductToBranchForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form style={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="branch" style={{ width: '100%' }}>
                <Form.Label style={{ textAlign: 'right' }} column sm={4}>{local.branch}</Form.Label>
                <Col sm={6}>
                    <Select
                        name="branch"
                        data-qc="branch"
                        value={values.branch}
                        enableReinitialize={false}
                        onChange={(event: any) => { setFieldValue('branch', event); props.getProducts(event.value) }}
                        type='text'
                        options={props.branchesLabels}
                        onBlur={handleBlur}
                        isInvalid={errors.branch && touched.branch}
                    />
                    <Form.Control.Feedback type="invalid" style={{ display: (errors.branch && touched.branch) ? 'block' : 'none' }}>
                        {(errors.branch && touched.branch) ? errors.branch.label : ''}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            {props.products.length > 0 &&
                <div style={{ width: '100%' }}>
                    <div style={{display:'flex', textAlign:'right'}}>
                        <p style={{ width:'50%'}}>
                            {local.loanProducts}
                        </p>
                        <p style={{ width:'46%', marginRight:'4%'}}>
                            {local.loanProductsForBranch}
                        </p>
                    </div>
                    <DualListBox
                        canFilter
                        options={props.products}
                        selected={props.selectedBranchProducts}
                        onChange={props.onChangeProducts}
                        style={{ height: '100%'}}
                        // alignActions='top'
                        icons={{
                            moveLeft: <span className="fa fa-chevron-right" />,
                            moveAllLeft: [
                                <span key={0} className="fa fa-chevron-right" />,
                                <span key={1} className="fa fa-chevron-right" />,
                            ],
                            moveRight: <span className="fa fa-chevron-left" />,
                            moveAllRight: [
                                <span key={0} className="fa fa-chevron-left" />,
                                <span key={1} className="fa fa-chevron-left" />,
                            ],
                            moveDown: <span className="fa fa-chevron-down" />,
                            moveUp: <span className="fa fa-chevron-up" />,
                        }}
                    />
                </div>
            }
            <Button type="button" style={{ margin: 10 }} onClick={handleSubmit}>{local.submit}</Button>
        </Form >
    )
}