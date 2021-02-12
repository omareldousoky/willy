import React from "react";
import { FieldProps } from "formik";
import { Col, FormControl, InputGroup } from "react-bootstrap";
import * as local from "../../../../Shared/Assets/ar.json";

interface DateFieldProps {
  key: string;
  id: string;
  smSize?: number;
}

export const DateField = (props: DateFieldProps & FieldProps<string>) => {
  const { field, form, meta, key, id, smSize, ...restProps } = props;
  const { touched, errors } = form;

  return (
    <Col sm={smSize || 12} className="d-flex flex-column">
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
