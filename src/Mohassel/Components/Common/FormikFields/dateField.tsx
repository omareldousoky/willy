import React from "react";
import { FieldProps } from "formik";
import { Col, FormControl, InputGroup } from "react-bootstrap";
import * as local from "../../../../Shared/Assets/ar.json";

interface DateFieldProps {
  key: string;
  id: string;
}

export const DateField = (props: DateFieldProps & FieldProps<string>) => {
  const { field, form, meta, key, id, ...restProps } = props;
  const { touched, errors } = form;

  return (
    <Col className="d-flex flex-column col-12">
      <InputGroup key={key} className="mb-2">
        <InputGroup.Append>
          <InputGroup.Text id={id || field.name}>{local.date}</InputGroup.Text>
        </InputGroup.Append>
        <FormControl type="date" {...field} {...restProps} className="mr-0" />
      </InputGroup>
      {touched[field.name] && errors[field.name] && (
        <small className="text-danger ml-auto mb-2">{errors[field.name]}</small>
      )}
    </Col>
  );
};
