import React, { ChangeEvent, SyntheticEvent } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Field, Formik, FormikProps } from "formik";
import { reportsModalValidation } from "./reportsModalValidation";
import { PDF } from "./reports";
import {
  AsyncBranchGeoAreasDropDown,
  AsyncLoanOfficersDropDown,
  BranchesDropDown,
} from "../dropDowns/allDropDowns";
import * as local from "../../../Shared/Assets/ar.json";
import { Branch } from "../../../Shared/Services/interfaces";
import DateField from "../Common/FormikFields/dateField";
import { required } from "../../../Shared/validations";
import { DateFromToField } from "./Fields/dateFromTo";
import TextField from "../Common/FormikFields/textField";

interface InitialFormikState {
  fromDate?: string;
  toDate?: string;
  quarterYear?: string;
  branches: Array<Branch>;
  quarterNumber?: string;
  key?: string;
  loanOfficers?: Array<string>;
  date?: string;
  loanOfficerIds?: Array<string>;
  representatives?: Array<string>;
  gracePeriod?: number;
  geoAreas?: Array<string>;
  creationDateFrom?: string;
  creationDateTo?: string;
  loanApplicationKey?: string;
}

interface Props {
  pdf: PDF;
  show: boolean;
  hideModal: () => void;
  submit: (values) => void;
  getExcel?: (values) => void;
}

const ReportsModal = (props: Props) => {
  const getIds = (list: Record<string, string>[]): string[] =>
    list?.length ? list.map((item) => item._id) : [];
  function handleSubmit(values) {
    props.submit({
      ...values,
      representatives: getIds(values.representatives),
      loanOfficers: getIds(values.representatives),
      loanOfficerIds: getIds(values.representatives),
      geoAreas: getIds(values.geoAreas),
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
        case "representatives":
          initValues.representatives = [];
          initValues.loanOfficers = [];
          initValues.loanOfficerIds = [];
        case "gracePeriod":
          initValues.gracePeriod = 0;
        case "geoAreas":
          initValues.geoAreas = [];
        case "creationDateFromTo":
          initValues.creationDateFrom = "";
          initValues.creationDateTo = "";
        case "applicationKey":
          initValues.loanApplicationKey = "";
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
      >
        {(formikProps: FormikProps<InitialFormikState>) => {
          return (
            <Form onSubmit={formikProps.handleSubmit}>
              <Modal.Header>
                <Modal.Title>{props.pdf.local}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="report-modal">
                <Row>
                  {props.pdf.inputs?.map((input) => {
                    if (input === "dateFromTo") {
                      return (
                        <DateFromToField
                          key={input}
                          id={input}
                          name={local.date}
                          from={{
                            name: "fromDate",
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              formikProps.setFieldValue(
                                "fromDate",
                                e.currentTarget.value
                              );
                              if (e.currentTarget.value === "")
                                formikProps.setFieldValue("toDate", "");
                            },
                            value: formikProps.values.fromDate,
                            error: formikProps.errors.fromDate,
                            isInvalid: !!(
                              formikProps.errors.fromDate &&
                              formikProps.touched.fromDate
                            ),
                          }}
                          to={{
                            name: "toDate",
                            min: formikProps.values.fromDate,
                            onChange: formikProps.handleChange,
                            value: formikProps.values.toDate,
                            error: formikProps.errors.toDate,
                            isInvalid: !!(
                              formikProps.errors.toDate &&
                              formikProps.touched.toDate
                            ),
                            disabled: !formikProps.values.fromDate,
                          }}
                        />
                      );
                    }
                    if (input === "branches") {
                      return (
                        <Col key={input} sm={12}>
                          <BranchesDropDown
                            isMulti
                            onlyValidBranches
                            onSelectBranch={(branches) => {
                              formikProps.setFieldValue("branches", branches);
                              formikProps.setFieldValue("representatives", []);
                            }}
                          />
                          <span className="text-danger">
                            {formikProps.errors.branches}
                          </span>
                        </Col>
                      );
                    }
                    if (input === "customerKey") {
                      return (
                        <Field
                          name="key"
                          id="key"
                          displayName={local.customerCode}
                          value={formikProps.values.key}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            !!(
                              formikProps.errors.key && formikProps.touched.key
                            )
                          }
                          component={TextField}
                          key={input}
                          validate={required}
                        />
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
                                    formikProps.setFieldValue(
                                      "quarterYear",
                                      ""
                                    );
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
                        <Col key={input} sm={6}>
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
                          type="date"
                          name="date"
                          id="date"
                          value={formikProps.values.date}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            !!(
                              formikProps.errors.date &&
                              formikProps.touched.date
                            )
                          }
                          component={DateField}
                          key={input}
                          validate={required}
                        />
                      );
                    }
                    if (input === "representatives") {
                      return (
                        <Col key={input} sm={12}>
                          <AsyncLoanOfficersDropDown
                            isMulti
                            onSelectOption={(loanOfficers) => {
                              formikProps.setFieldValue(
                                "representatives",
                                Array.isArray(loanOfficers)
                                  ? loanOfficers
                                  : [loanOfficers]
                              );
                            }}
                            branchId={
                              (formikProps.values.branches &&
                                formikProps.values.branches.length === 1 &&
                                formikProps.values.branches[0]._id) ||
                              undefined
                            }
                            isDisabled={
                              !formikProps.values.branches ||
                              (formikProps.values.branches &&
                                (!formikProps.values.branches.length ||
                                  formikProps.values.branches.length > 1))
                            }
                          />
                          <span className="text-danger">
                            {formikProps.errors.representatives}
                          </span>
                        </Col>
                      );
                    }
                    if (input === "gracePeriod") {
                      return (
                        <Field
                          name="gracePeriod"
                          id="gracePeriod"
                          type="number"
                          min={0}
                          displayName={local.gracePeriod}
                          value={formikProps.values.gracePeriod}
                          onChange={formikProps.handleChange}
                          isInvalid={
                            !!(
                              formikProps.errors.gracePeriod &&
                              formikProps.touched.gracePeriod
                            )
                          }
                          component={TextField}
                          key={input}
                        />
                      );
                    }
                    if (input === "geoAreas") {
                      return (
                        <Col key={input} sm={12}>
                          <AsyncBranchGeoAreasDropDown
                            isMulti
                            onSelectOption={(geoAreas) => {
                              formikProps.setFieldValue(
                                "geoAreas",
                                Array.isArray(geoAreas) ? geoAreas : [geoAreas]
                              );
                            }}
                            branchId={
                              (formikProps.values.branches &&
                                formikProps.values.branches.length === 1 &&
                                formikProps.values.branches[0]?._id) ||
                              undefined
                            }
                            // disable for non-selected branch, all branches, multi selected branches
                            isDisabled={
                              !formikProps.values.branches ||
                              (formikProps.values.branches &&
                                (!formikProps.values.branches.length ||
                                  formikProps.values.branches.length > 1 ||
                                  (!!formikProps.values.branches.length &&
                                    !formikProps.values.branches[0]?._id)))
                            }
                          />
                          <span className="text-danger">
                            {formikProps.errors.geoAreas}
                          </span>
                        </Col>
                      );
                    }
                    if (input === "creationDateFromTo") {
                      return (
                        <DateFromToField
                          key={input}
                          id={input}
                          name={local.creationDate}
                          from={{
                            name: "creationDateFrom",
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              formikProps.setFieldValue(
                                "creationDateFrom",
                                e.currentTarget.value
                              );
                              if (e.currentTarget.value === "")
                                formikProps.setFieldValue("creationDateTo", "");
                            },
                            value: formikProps.values.creationDateFrom,
                            error: formikProps.errors.creationDateFrom,
                            isInvalid: !!(
                              formikProps.errors.creationDateFrom &&
                              formikProps.touched.creationDateFrom
                            ),
                          }}
                          to={{
                            name: "creationDateTo",
                            min: formikProps.values.creationDateFrom,
                            onChange: formikProps.handleChange,
                            value: formikProps.values.creationDateTo,
                            error: formikProps.errors.creationDateTo,
                            isInvalid: !!(
                              formikProps.errors.creationDateTo &&
                              formikProps.touched.creationDateTo
                            ),
                            disabled: !formikProps.values.creationDateFrom,
                          }}
                        />
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
                    "customerTransactionReport"
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
          );
        }}
      </Formik>
    </Modal>
  );
};

export default ReportsModal;
