import React, { Component } from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import * as local from '../../../Shared/Assets/ar.json';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { search, searchFilters } from '../../redux/search/actions';
import { BranchesDropDown } from '../dropDowns/allDropDowns';

interface InitialFormikState {
  name?: string;
  fromDate?: string;
  toDate?: string;
  governorate?: string;
  status?: string;
  branchId?: string;
}
interface Props {
  size: number;
  from: number;
  url: string;
  roleId?: string;
  searchKeys: Array<string>;
  search: (data) => void;
  searchFilters: (data) => void;
}
class Search extends Component<Props, {}> {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  submit = async (values) => {
    const obj = { ...values, ...{ from: this.props.from }};
    if (obj.hasOwnProperty('fromDate'))
      obj.fromDate = new Date(obj.fromDate).setHours(0, 0, 0, 0).valueOf();
    if (obj.hasOwnProperty('toDate'))
      obj.toDate = new Date(obj.toDate).setHours(23, 59, 59, 59).valueOf();
    if(this.props.roleId)
      obj.roleId = this.props.roleId;
    obj.from = 0;
    this.props.searchFilters(obj);
    this.props.search({ ...obj, size: this.props.size, url: this.props.url })
  }
  getInitialState() {
    const initialState: InitialFormikState = {};
    this.props.searchKeys.forEach(searchkey => {
      switch (searchkey) {
        case 'keyword':
          initialState.name = '';
          break;
        case 'governorate':
          initialState.governorate = '';
        case 'status':
          initialState.status = '';
        case 'branch':
          initialState.branchId = '';
        case 'status-application':
          initialState.status = '';
      }
    })
    return initialState;
  }
  render() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.getInitialState()}
        onSubmit={this.submit}
        // validationSchema={}
        validateOnBlur
        validateOnChange>
        {(formikProps) =>
          <Form onSubmit={formikProps.handleSubmit} style={{ padding: '10px 30px 26px 30px' }}>
            <Row>
              {this.props.searchKeys.map((searchKey, index) => {
                if (searchKey === 'keyword') {
                  return (
                    <Col key={index} sm={6}>
                      <InputGroup style={{ direction: 'ltr', flex: 1, marginLeft: 20 }}>
                        <Form.Control
                          type="text"
                          name="name"
                          data-qc="name"
                          onChange={formikProps.handleChange}
                          style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                          placeholder={local.searchByNameOrNationalId}
                        />
                        <InputGroup.Append>
                          <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Col>
                  );
                }
                if (searchKey === 'dateFromTo') {
                  return (
                    <Col key={index} sm={6}>
                      <div className="dropdown-container" style={{ flex: 1, alignItems: 'center' }}>
                        <p className="dropdown-label" style={{ alignSelf: 'normal', marginLeft: 20, width: 300 }}>{local.creationDate}</p>
                        <span>{local.from}</span>
                        <Form.Control
                          style={{ marginLeft: 20, border: 'none' }}
                          type="date"
                          name="fromDate"
                          data-qc="fromDate"
                          value={formikProps.values.fromDate}
                          onChange={(e) => {
                            formikProps.setFieldValue("fromDate", e.currentTarget.value);
                            if (e.currentTarget.value === "") formikProps.setFieldValue("toDate", "")
                          }}
                        >
                        </Form.Control>
                        <span>{local.to}</span>
                        <Form.Control
                          style={{ marginRight: 20, border: 'none' }}
                          type="date"
                          name="toDate"
                          data-qc="toDate"
                          value={formikProps.values.toDate}
                          min={formikProps.values.fromDate}
                          onChange={formikProps.handleChange}
                          disabled={!Boolean(formikProps.values.fromDate)}
                        >
                        </Form.Control>
                      </div>
                    </Col>
                  );
                }
                if (searchKey === 'governorate') {
                  return (
                    <Col key={index} sm={6}>
                      <div className="dropdown-container" style={{ marginTop: 20 }}>
                        <p className="dropdown-label">{local.governorate}</p>
                        <Form.Control as="select" className="dropdown-select" data-qc="governorate" onChange={formikProps.handleChange}>
                          <option value={5} data-qc={5}>5</option>
                          <option value={10} data-qc={10}>10</option>
                        </Form.Control>
                      </div>
                    </Col>
                  )
                }
                if (searchKey === 'employment') {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.employment}</p>
                        <Form.Control as="select" className="dropdown-select" data-qc="employment" onChange={formikProps.handleChange}>
                          <option value={5} data-qc={5}>5</option>
                          <option value={10} data-qc={10}>10</option>
                        </Form.Control>
                      </div>
                    </Col>
                  )
                }
                if (searchKey === 'status') {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.status}</p>
                        <Form.Control as="select" className="dropdown-select" data-qc="status" value={formikProps.values.status} onChange={(e) => { formikProps.setFieldValue('status', e.currentTarget.value) }}>
                          <option value="" data-qc="all">{local.all}</option>
                          <option value='paid' data-qc='paid'>{local.paid}</option>
                          <option value='issued' data-qc='issued'>{local.issued}</option>
                        </Form.Control>
                      </div>
                    </Col>
                  )
                }
                if (searchKey === 'status-application') {
                  return (
                  <Col key={index} sm={6} style={{ marginTop: 20 }}>
                    <div className="dropdown-container">
                      <p className="dropdown-label">{local.status}</p>
                      <Form.Control as="select" className="dropdown-select" data-qc="status" value={formikProps.values.status} onChange={(e) => { formikProps.setFieldValue('status', e.currentTarget.value) }}>
                        <option value="" data-qc="all">{local.all}</option>
                        <option value='underReview' data-qc='underReview'>{local.underReview}</option>
                        <option value='reviewed' data-qc='reviewed'>{local.reviewed}</option>
                        <option value='approved' data-qc='approved'>{local.approved}</option>
                        <option value='created' data-qc='created'>{local.created}</option>
                        <option value='rejected' data-qc='rejected'>{local.rejected}</option>
                      </Form.Control>
                    </div>
                  </Col>
                  )
                }
                if (searchKey === 'branch') {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <BranchesDropDown onSelectBranch={(branch) => { formikProps.setFieldValue('branchId', branch._id) }} />
                    </Col>
                  )
                }
              })}
              <Col>
                <Button type="submit" style={{ width: 180, height: 50, marginTop: 20 }}>{local.search}</Button>
              </Col>
            </Row>
          </Form>
        }
      </Formik>
    );
  }
}

const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
    searchFilters: data => dispatch(searchFilters(data))
  };
};

export default connect(null, addSearchToProps)(Search);