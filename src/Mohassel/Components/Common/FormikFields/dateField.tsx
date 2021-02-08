import React from "react";
import { FieldProps } from "formik";
import { Form } from "react-bootstrap";
import * as local from "../../../../Shared/Assets/ar.json";

interface DateFieldProps {
  key: string;
  id: string;
}

export const DateField = (props: DateFieldProps & FieldProps<string>) => {
  const { field, form, meta, key, id, ...restProps } = props;
  const { touched, errors } = form;

  return (
    <Form.Group controlId={id || field.name} key={key} className="col-sm-12">
      <div
        className="dropdown-container"
        style={{ flex: 2, alignItems: "center" }}
      >
        <p className="dropdown-label">{local.date}</p>
        <Form.Control type="date" {...field} {...restProps} />
      </div>
      {touched[field.name] && errors[field.name] && (
        <small className="text-danger">{errors[field.name]}</small>
      )}
    </Form.Group>
  );
};
