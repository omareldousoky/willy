import React ,{useRef} from "react";
import { FieldProps } from "formik";
import {Col, FormControl, InputGroup } from "react-bootstrap";
import * as local from "../../../../Shared/Assets/ar.json";

interface DateFieldProps {
  key: string;
  id: string;
  smSize?: number;
  className?: string;
  onlyField?: boolean;
  fieldClassName?: string;
  label?: string;
  isClearable?: boolean;
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
    isClearable,
    ...restProps
  } = props;
  const { touched, errors } = form;
  const inputRef = useRef<HTMLInputElement>(null);
 const onClear =() =>{
   if(null !== inputRef?.current && inputRef.current.value){
        inputRef.current.value='';
   }
  }
  return (
    <>
      {!onlyField && (
        <Col
          sm={smSize || 12}
          className={`d-flex flex-column ${className || ""}`}
        >
          <InputGroup key={key}>
            <InputGroup.Prepend>
              <InputGroup.Text id={`${id || field.name}Text`}>
                {label || local.date}
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              ref={inputRef}
              type="date"
              {...field}
              {...restProps}
              id={id || field.name}
              className="mr-0"
            />
            {isClearable &&
            <InputGroup.Append>
            <InputGroup.Text
               onClick={onClear}><img className="w-75 h-75" src={require('../../../Assets/clear.svg')}/>
               </InputGroup.Text></InputGroup.Append>
            }
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
