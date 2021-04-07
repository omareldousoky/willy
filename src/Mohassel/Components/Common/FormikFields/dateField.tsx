import React from "react";
import { FieldProps } from "formik";
import { Col, FormControl, InputGroup } from "react-bootstrap";
import * as local from "../../../../Shared/Assets/ar.json";

interface DateFieldProps {
  key: string;
  id: string;
  smSize?: number;
  className?: string;
  onlyField?: boolean;
  fieldClassName?: string;
  label?: string;
}

const DateField = (props: DateFieldProps & FieldProps<string>) => {
  const {
    field,
    form,
    meta,
    key,
    id,
    smSize,
    className,
    fieldClassName,
    onlyField = false,
    label,
    ...restProps
  } = props;
  const { touched, errors } = form;

  return (
    <>
      {!onlyField && (
        <Col
          sm={smSize || 12}
          className={`d-flex flex-column ${className || ""}`}
        >
          <InputGroup key={key}>
            <InputGroup.Append>
              <InputGroup.Text id={`${id || field.name}Text`}>
                {label || local.date}
              </InputGroup.Text>
            </InputGroup.Append>
            <FormControl
              type="date"
              {...field}
              {...restProps}
              id={id || field.name}
              className="mr-0"
            />
          </InputGroup>
          {touched[field.name] && errors[field.name] && (
            <small className="text-danger ml-auto mb-2">
              {errors[field.name]}
            </small>
          )}
        </Col>
      )}
      {onlyField && (
        <FormControl
          type="date"
          {...field}
          {...restProps}
          id={id || field.name}
          className={`mr-0 ${fieldClassName || ""}`}
        />
      )}
    </>
  );
};

export default DateField;
