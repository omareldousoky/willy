import React, {
  ChangeEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
} from 'react'

import Form from 'react-bootstrap/Form'
import { FormControlProps } from 'react-bootstrap/FormControl'

import { Schema } from 'yup'

import { getDateString } from '../../../../Shared/Services/utils'
import { DocumentField, FormField, FormFieldProps } from './types'
import DocumentPhoto from '../../../../Shared/Components/documentPhoto/documentPhoto'
import { AppFormContext } from '.'
import { getNestedByStringKey } from './utils'
import DocumentUploader from '../../../../Shared/Components/documentUploader/documentUploader'
import { useDispatch, useSelector } from 'react-redux'
import {
  getDocuments,
  invalidDocument,
} from '../../../../Shared/redux/document/actions'
import { Document } from '../../../../Shared/Services/interfaces'
import { DocumentsType } from '../../../../Shared/redux/document/types'

const FormField: FunctionComponent<FormFieldProps> = ({
  field,
  formikProps: {
    values,
    setFieldValue,
    handleChange,
    handleBlur,
    touched,
    errors,
  },
}) => {
  const { defaultValues, onPhotoChange, formFields } = useContext(
    AppFormContext
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fieldErrors = getNestedByStringKey(errors, field.name)
  const isTouched = !!getNestedByStringKey(touched, field.name)

  const value = getNestedByStringKey(
    values,
    field.name
  ) as FormControlProps['value']

  const isRequired = (validationSchema: Schema<any>) =>
    !!validationSchema &&
    !!validationSchema
      .describe()
      .tests.find((test: any) => test.name === 'required')

  const isDocument = (field?: FormField): field is DocumentField =>
    !!field && field.type === 'document'

  const label = !isDocument(field)
    ? `${field.label}${isRequired(field.validation) ? ' *' : ''}`
    : ''

  const trimField = (e: React.FocusEvent<any>) => {
    setFieldValue(e.target.name, e.target.value.trim().replace(/\s\s+/g, ' '))
  }

  const dispatch = useDispatch()
  useEffect(() => {
    if (isDocument(field)) {
      dispatch(
        getDocuments({
          [field.keyName]: field.keyId,
          docType: field.documentType.type,
        })
      )
    }
  }, [])

  const fieldToClear = formFields.find(
    ({ name }) => name === field.clearFieldOnChange
  )

  const documentImages: Document[] =
    (useSelector((state: any) => state.documents) || []).find(
      (document: DocumentsType) => {
        const fieldName = isDocument(fieldToClear)
          ? fieldToClear.name
          : field.name

        return document?.docName === fieldName
      }
    )?.imagesFiles ?? []

  const validDocuments = documentImages.filter((document) => document.valid)

  const handleDocumentDelete = (name: string) => {
    const lastDocument = documentImages[documentImages.length - 1]
    lastDocument && dispatch(invalidDocument(lastDocument.key, name))
  }

  useEffect(() => {
    if (isDocument(field)) {
      values[field.name] = documentImages
    }
  }, [validDocuments.length])

  const handleFieldChange = (e: ChangeEvent<any>) => {
    if (field.clearFieldOnChange) {
      isDocument(fieldToClear)
        ? handleDocumentDelete(field.clearFieldOnChange)
        : setFieldValue(field.clearFieldOnChange, '')
    }

    handleChange(e)
  }

  const inputFieldProps = {
    onBlur:
      field.type === 'text' || field.type === 'textarea'
        ? (e: React.FocusEvent<any>) => {
            trimField(e)
            handleBlur(e)
          }
        : handleBlur,
    name: field.name,
    value,
    onChange: handleFieldChange,
    readOnly: field.readOnly ?? false,
    disabled: field.disabled ?? field.readOnly ?? false,
    isInvalid: !!fieldErrors && isTouched,
    'data-qc': field.name,
  }

  const renderFormField = () => {
    switch (field.type) {
      case 'checkbox':
        return (
          <Form.Check
            {...inputFieldProps}
            disabled={inputFieldProps.readOnly}
            type="checkbox"
            label={field.checkboxLabel}
            defaultChecked={!!inputFieldProps.value}
          />
        )

      case 'select':
        return (
          <Form.Control
            {...inputFieldProps}
            as="select"
            className="dropdown-select"
            defaultValue=""
          >
            <option disabled value="" />
            {field.options.map(({ label: fieldLabel, value: fieldValue }) => (
              <option key={fieldValue} value={fieldValue} data-qc={fieldValue}>
                {fieldLabel}
              </option>
            ))}
          </Form.Control>
        )

      case 'textarea':
        return <Form.Control {...inputFieldProps} as="textarea" rows={3} />

      case 'photo':
        return (
          <DocumentPhoto
            data-qc={inputFieldProps['data-qc']}
            name={inputFieldProps.name}
            handleImageChange={(imageFile) => {
              setFieldValue(inputFieldProps.name, imageFile)
              onPhotoChange && onPhotoChange(inputFieldProps.name, imageFile)
            }}
            handleBlur={inputFieldProps.onBlur}
            view={inputFieldProps.disabled}
            edit={!inputFieldProps.disabled}
            photoURL={defaultValues[field.name + 'URL'] ?? ''}
          />
        )

      case 'file':
        return (
          <Form.File
            name={inputFieldProps.name}
            id={inputFieldProps.name}
            type="file"
            accept={field.accepts}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFieldValue(inputFieldProps.name, e.currentTarget.files)
            }
            onClick={() => {
              if (fileInputRef.current === null) return
              fileInputRef.current.value = ''
            }}
            ref={fileInputRef}
          />
        )

      case 'document':
        return (
          <DocumentUploader
            documentType={field.documentType}
            edit={!inputFieldProps.disabled}
            keyName={field.keyName}
            keyId={field.keyId}
            view={inputFieldProps.disabled}
            handleChangeFromParent={true}
          />
        )

      default:
        return (
          <Form.Control
            {...inputFieldProps}
            type={field.type}
            value={
              field.type === 'date' && inputFieldProps.value
                ? getDateString(inputFieldProps.value)
                : inputFieldProps.value
            }
          />
        )
    }
  }

  return (
    <Form.Group controlId={field.name}>
      <Form.Label column title={label}>
        {label}
      </Form.Label>
      {field.header}
      {renderFormField()}
      <Form.Control.Feedback type="invalid">
        {getNestedByStringKey(errors, field.name)}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

export default FormField
