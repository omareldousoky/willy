import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import * as local from '../../Shared/Assets/ar.json'

export const LoginForm = (props: any) => {
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
  } = props
  return (
    <Container style={{ maxWidth: 500 }}>
      <Form
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
        onSubmit={handleSubmit}
      >
        <Form.Group
          as={Row}
          controlId="username"
          style={{ marginTop: 30, width: '100%' }}
        >
          <Form.Control
            type="text"
            name="username"
            data-qc="username"
            placeholder={local.username}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={errors.username && touched.username}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          as={Row}
          controlId="password"
          style={{ margin: '20px 0px 30px 0px', width: '100%' }}
        >
          <Form.Control
            type="password"
            name="password"
            data-qc="password"
            placeholder={local.password}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={errors.password && touched.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          type="submit"
          data-qc="submit"
          style={{ alignSelf: 'flex-end' }}
        >
          {local.login}
        </Button>
      </Form>
    </Container>
  )
}
