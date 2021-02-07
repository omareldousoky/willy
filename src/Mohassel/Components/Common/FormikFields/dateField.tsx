import React, { useState } from "react";
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
    <Form.Group controlId={id || field.name} key={key}>
      <div
        className="dropdown-container row-nowrap"
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
        <Form.Control type="date" {...field} {...restProps} />
      </div>
      {touched[field.name] && errors[field.name] && (
        <small className="text-danger">{errors[field.name]}</small>
      )}
    </Form.Group>
  );
};
