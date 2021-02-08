import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Field, Formik, FormikProps, yupToFormErrors } from "formik";
import { reportsModalValidation } from "./reportsModalValidation";
import { PDF } from "./reports";
import {
  AsyncLoanOfficersDropDown,
  BranchesDropDown,
} from "../dropDowns/allDropDowns";
import * as local from "../../../Shared/Assets/ar.json";
import { Branch } from "../../../Shared/Services/interfaces";
import { DateField } from "../Common/FormikFields/dateField";
import { required } from "../../../Shared/validations";

interface InitialFormikState {
  fromDate?: string;
  toDate?: string;
  quarterYear?: string;
  branches: Array<Branch>;
  quarterNumber?: string;
  key?: string;
  loanOfficers?: Array<string>;
  date?: string;
}

interface Props {
  pdf: PDF;
  show: boolean;
  hideModal: () => void;
  submit: (values) => void;
  getExcel?: (values) => void;
}

const ReportsModal = (props: Props) => {
  function handleSubmit(values) {
    props.submit({
      ...values,
      loanOfficers: values.loanOfficers.length
        ? values.loanOfficers.map((officer) => officer._id)
        : [],
    });
  }
  function getInitialValues() {
    const initValues: InitialFormikState = { branches: [] };
    props.pdf.inputs?.forEach((input) => {
      switch (input) {
        case "dateFromTo":
          initValues.fromDate = "";
          initValues.toDate = "";
        case "branches":
          initValues.branches = [];
        case "customerKey":
          initValues.key = "";
        case "quarterYear":
          initValues.quarterYear = "";
        case "quarterNumber":
          initValues.quarterNumber = "01";
        case "date":
          initValues.date = "";
        case "loanOfficers":
          initValues.loanOfficers = [];
      }
    });
    return initValues;
  }
  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={() => {
        props.hideModal();
      }}
    >
      <Formik
        initialValues={getInitialValues()}
        onSubmit={handleSubmit}
        validationSchema={reportsModalValidation}
        validateOnBlur
        validateOnChange
      >
        {(formikProps: FormikProps<InitialFormikState>) => (
          <Form onSubmit={formikProps.handleSubmit}>
            <Modal.Header>
              <Modal.Title>{props.pdf.local}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                {props.pdf.inputs?.map((input) => {
                  if (input === "dateFromTo") {
                    return (
                      <Col sm={12} key={input}>
                        <Form.Group controlId="fromToDate">
                          <div
                            className="dropdown-container"
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
                            <span>{local.from}</span>
                            <Form.Control
                              style={{ marginLeft: 20, border: "none" }}
                              type="date"
                              name="fromDate"
                              data-qc="fromDate"
                              value={formikProps.values.fromDate}
                              isInvalid={Boolean(
                                formikProps.errors.fromDate &&
                                  formikProps.touched.fromDate
                              )}
                              onChange={(e) => {
                                formikProps.setFieldValue(
                                  "fromDate",
                                  e.currentTarget.value
                                );
                                if (e.currentTarget.value === "")
                                  formikProps.setFieldValue("toDate", "");
                              }}
                            ></Form.Control>
                            <span>{local.to}</span>
                            <Form.Control
                              style={{ marginRight: 20, border: "none" }}
                              type="date"
                              name="toDate"
                              data-qc="toDate"
                              value={formikProps.values.toDate}
                              min={formikProps.values.fromDate}
                              onChange={formikProps.handleChange}
                              isInvalid={Boolean(
                                formikProps.errors.toDate &&
                                  formikProps.touched.toDate
                              )}
                              disabled={!Boolean(formikProps.values.fromDate)}
                            ></Form.Control>
                          </div>
                          <span style={{ color: "red" }}>
                            {formikProps.errors.toDate}
                          </span>
                        </Form.Group>
                      </Col>
                    );
                  }
                  if (input === "branches") {
                    return (
                      <Col key={input} sm={12} style={{ marginTop: 20 }}>
                        <BranchesDropDown
                          multiselect={true}
                          onSelectBranch={(branches) => {
                            formikProps.setFieldValue("branches", branches);
                            formikProps.setFieldValue("loanOfficers", []);
                          }}
                        />
                        <span style={{ color: "red" }}>
                          {formikProps.errors.branches}
                        </span>
                      </Col>
                    );
                  }
                  if (input === "customerKey") {
                    return (
                      <Col sm={12} key={input} style={{ marginTop: 20 }}>
                        <Form.Group controlId="key">
                          <div className="dropdown-container">
                            <p
                              className="dropdown-label"
                              style={{ width: 150 }}
                            >
                              {local.customerCode}
                            </p>
                            <Form.Control
                              className="dropdown-select"
                              name="key"
                              data-qc="key"
                              value={formikProps.values.key}
                              isInvalid={Boolean(
                                formikProps.errors.key &&
                                  formikProps.touched.key
                              )}
                              onChange={formikProps.handleChange}
                            />
                          </div>
                          <span style={{ color: "red" }}>
                            {Boolean(
                              formikProps.errors.key && formikProps.touched.key
                            )
                              ? formikProps.errors.key
                              : ""}
                          </span>
                        </Form.Group>
                      </Col>
                    );
                  }
                  if (input === "quarterYear") {
                    return (
                      <Col sm={12} key={input}>
                        <Form.Group controlId="quarterYear">
                          <div
                            className="dropdown-container"
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
                            <span>{local.from}</span>
                            <Form.Control
                              style={{ marginLeft: 20, border: "none" }}
                              type="date"
                              name="quarterYear"
                              data-qc="quarterYear"
                              value={formikProps.values.quarterYear}
                              isInvalid={Boolean(
                                formikProps.errors.quarterYear &&
                                  formikProps.touched.quarterYear
                              )}
                              onBlur={formikProps.handleBlur}
                              onChange={(e) => {
                                formikProps.setFieldValue(
                                  "quarterYear",
                                  e.currentTarget.value
                                );
                                if (e.currentTarget.value === "")
                                  formikProps.setFieldValue("quarterYear", "");
                              }}
                            ></Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {formikProps.errors.quarterYear}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    );
                  }
                  if (input === "quarterNumber") {
                    return (
                      <Col key={input} sm={6} style={{ marginTop: 20 }}>
                        <div
                          className="dropdown-container"
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
                            {local.noOfQuarter}
                          </p>
                          <Form.Control
                            as="select"
                            className="dropdown-select"
                            data-qc="quarterNumber"
                            name="quarterNumber"
                            value={formikProps.values.quarterNumber}
                            onChange={(e) => {
                              formikProps.setFieldValue(
                                "quarterNumber",
                                e.currentTarget.value
                              );
                            }}
                          >
                            <option value="01" data-qc="approved">
                              {"1"}
                            </option>
                            <option value="02" data-qc="created">
                              {"2"}
                            </option>
                            <option value="03" data-qc="rejected">
                              {"3"}
                            </option>
                            <option value="04" data-qc="canceled">
                              {"4"}
                            </option>
                          </Form.Control>
                        </div>
                      </Col>
                    );
                  }
                  if (input === "date") {
                    return (
                      <Field
                        style={{ marginRight: 20 }}
                        type="date"
                        name="date"
                        id="date"
                        value={formikProps.values.date}
                        onChange={formikProps.handleChange}
                        isInvalid={
                          !!(
                            formikProps.errors.date && formikProps.touched.date
                          )
                        }
                        component={DateField}
                        key={input}
                        validate={required}
                      />
                    );
                  }
                  if (input === "loanOfficers") {
                    return (
                      <Col key={input} sm={12} style={{ marginTop: 20 }}>
                        <AsyncLoanOfficersDropDown
                          isMulti
                          onSelectLoanOfficer={(loanOfficers) => {
                            formikProps.setFieldValue(
                              "loanOfficers",
                              Array.isArray(loanOfficers)
                                ? loanOfficers
                                : [loanOfficers]
                            );
                          }}
                          isDisabled={
                            !formikProps.values.branches ||
                            (formikProps.values.branches &&
                              (!formikProps.values.branches.length ||
                                formikProps.values.branches.length > 1))
                          }
                        />
                        <span style={{ color: "red" }}>
                          {formikProps.errors.loanOfficers}
                        </span>
                      </Col>
                    );
                  }
                })}
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  props.hideModal();
                }}
              >
                {local.cancel}
              </Button>
              {props.pdf &&
                props.pdf.key &&
                ![
                  "customerDetails",
                  "loanDetails",
                  "cibPaymentReport",
                ].includes(props.pdf.key) &&
                props.getExcel && (
                  <Button
                    disabled={!!formikProps.errors.quarterYear}
                    variant="primary"
                    onClick={() => {
                      props.getExcel && props.getExcel(formikProps.values);
                    }}
                  >
                    {local.downloadExcel}
                  </Button>
                )}
              <Button type="submit" variant="primary">
                {local.downloadPDF}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ReportsModal;
