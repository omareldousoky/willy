import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../Shared/Assets/ar.json';

export const LoginForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue } = props;
    return (
        <Form style={{justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}} onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="username">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.username}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="username"
                        data-qc="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.username && touched.username}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.username}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="password" style={{margin:10}}>
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.password}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="password"
                        name="password"
                        data-qc="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.password && touched.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Button type="submit" style={{margin:10}}>{local.login}</Button>
        </Form >
    )
}
