import React, { Component } from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import * as local from '../../Assets/ar.json';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { search, searchFilters, issuedLoansSearchFilters } from '../../redux/search/actions';
import { BranchesDropDown } from '../../../Mohassel/Components/dropDowns/allDropDowns';
import { parseJwt, timeToDateyyymmdd } from '../../../Shared/Services/utils';
import { getCookie } from '../../Services/getCookie';
import { getGovernorates } from '../../../Mohassel/Services/APIs/configApis/config';
import { loading } from '../../redux/loading/actions';
import {getActionsList} from '../../../Mohassel/Services/APIs/ActionLogs/getActionsList';
import Swal from 'sweetalert2';
import Can from '../../../Mohassel/config/Can';

interface InitialFormikState {
  name?: string;
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  governorate?: string;
  status?: string;
  action?: string;
  branchId?: string;
  isDoubtful?: boolean;
  isWrittenOff?: boolean;
}
interface Props {
  size: number;
  from: number;
  url: string;
  roleId?: string;
  searchPlaceholder?: string;
  datePlaceholder?: string;
  hqBranchIdRequest?: string;
  status?: string;
  fundSource?: string;
  searchKeys: Array<string>;
  dropDownKeys?: Array<string>;
  issuedLoansSearchFilters: any;
  setFrom?: (from: number) => void;
  search: (data) => void;
  searchFilters: (data) => void;
  setIssuedLoansSearchFilters: (data) => void;
  setLoading: (data) => void;
}
interface State {
  governorates: Array<any>;
  dropDownValue: string;
  actionsList: Array<string>;
}
class Search extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      governorates: [],
      dropDownValue: this.props.url ==='actionLogs'? 'authorName' :'name',
      actionsList: [],
    }
  }
  componentDidMount() {
    if (this.props.url === 'customer') {
      this.getGov();
    }
    else if(this.props.url==="actionLogs") {
      this.getActionsList();
    }
  }
  async getGov() {
    this.props.setLoading(true);
    const res = await getGovernorates();
    if (res.status === 'success') {
      this.setState({ governorates: res.body.governorates });
      this.props.setLoading(false);
    } else {
      this.props.setLoading(false);
      console.log("Error getting governorates")
    }
  }
  async getActionsList(){
    this.props.setLoading(true);
    const res =  await  getActionsList();
    if(res.status === 'success'){
      this.setState({actionsList : res.body.data})
      this.props.setLoading(false);
    } else {
      this.props.setLoading(false);
      console.log("Error getting  actionsLogs list"); // log for purpose
    }
  }
  submit = async (values) => {
    let obj = { ...values, ...{ from: this.props.from } , [this.state.dropDownValue]: values.keyword};
    delete obj.keyword;
    if (obj.hasOwnProperty('fromDate'))
      obj.fromDate = new Date(obj.fromDate).setHours(0, 0, 0, 0).valueOf();
    if (obj.hasOwnProperty('toDate'))
      obj.toDate = new Date(obj.toDate).setHours(23, 59, 59, 59).valueOf();
    if (this.props.roleId)
      obj.roleId = this.props.roleId;
    obj.from = 0;
    if(obj.key) obj.key = isNaN(Number(obj.key)) ? 10 : Number(obj.key);
    if(obj.code) obj.code = isNaN(Number(obj.code)) ? 10 : Number(obj.code);
    if(obj.customerKey) obj.customerKey = Number(obj.customerKey);
    if(obj.customerCode) obj.customerCode = Number(obj.customerCode);
    if(this.props.url === 'loan' && obj.sort !== 'issueDate') {obj.sort = 'issueDate'}
    if(this.props.status) obj.status = this.props.status;
    if(this.props.fundSource) obj.fundSource = this.props.fundSource
    if(this.props.url === 'loan') this.props.setIssuedLoansSearchFilters(obj);
    if(this.props.url === 'application' && !obj.status && this.props.searchKeys.includes('review-application')) {obj.status='reviewed'}
    obj = this.removeEmptyArg(obj)
    this.props.setFrom ? this.props.setFrom(0) : null;
    this.props.searchFilters(obj);
    this.props.search({ ...obj, from: 0, size: this.props.size, url: this.props.url, branchId: this.props.hqBranchIdRequest? this.props.hqBranchIdRequest : values.branchId })
  }
  removeEmptyArg(obj) {
    Object.keys(obj).forEach(el => {
      if(obj[el] === "" || obj[el] === undefined) {
        delete obj[el];
      }
    })
    return obj;
  }
  getInitialState() {
    const initialState: InitialFormikState = {};
    this.props.searchKeys.forEach(searchkey => {
      switch (searchkey) {
        case 'dateFromTo': 
          initialState.fromDate = this.props.url === "loan" ? timeToDateyyymmdd(this.props.issuedLoansSearchFilters.fromDate) : '';
          initialState.toDate = this.props.url === "loan" ? timeToDateyyymmdd(this.props.issuedLoansSearchFilters.toDate) : '';
        case 'keyword':
          initialState.keyword = this.props.url === "loan" ? this.props.issuedLoansSearchFilters[this.state.dropDownValue]: '';
        case 'governorate':
          initialState.governorate = '';
        case 'status':
          initialState.status = this.props.url === "loan" ? this.props.issuedLoansSearchFilters.status : '';
        case 'branch':
          initialState.branchId = this.props.url === "loan"? this.props.issuedLoansSearchFilters.branchId : '';
        case 'status-application':
          initialState.status = this.props.url === "loan"? this.props.issuedLoansSearchFilters.status : '';
        case 'review-application':
          initialState.status = this.props.url === "application"? this.props.issuedLoansSearchFilters.status : '';
       case 'clearance-status':
          initialState.status = this.props.url === "clearance" ?   this.props.issuedLoansSearchFilters.status : ''; 
        case 'doubtful':
          initialState.isDoubtful = this.props.url === "loan"? this.props.issuedLoansSearchFilters.isDoubtful : false;
        case 'writtenOff' :
          initialState.isWrittenOff = this.props.url === "loan"? this.props.issuedLoansSearchFilters.isWrittenOff : false;;
      }
    })
    return initialState;
  }
  viewBranchDropdown() {
    const token = getCookie('token');
    const tokenData = parseJwt(token);
    if(this.props.hqBranchIdRequest) return false;
    if (this.props.url === 'application') {
      if (tokenData?.requireBranch === false) return true;
      else return false;
    } else return true;
  }
  getArValue(key: string){
    switch(key) {
      case 'name': return local.name;
      case 'nationalId': return local.nationalId;
      case 'key': return local.code;
      case 'code': return local.partialCode;
      case 'authorName': return local.employeeName;
      case 'customerKey': return local.customerCode;
      case 'customerCode': return local.customerPartialCode;
      case 'userName': return local.username;
      case 'hrCode': return local.hrCode;
      default: return '';
    }
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
                      <InputGroup style={{ direction: 'ltr' }}>
                        <FormControl
                          type="text"
                          name="keyword"
                          data-qc="searchKeyword"
                          onChange={formikProps.handleChange}
                          style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                          placeholder={this.props.searchPlaceholder}
                          value={formikProps.values.keyword}
                        />
                        <InputGroup.Append>
                          <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                        </InputGroup.Append>
                        {this.props.dropDownKeys && this.props.dropDownKeys.length?
                        <DropdownButton
                          as={InputGroup.Append}
                          variant="outline-secondary"
                          title={this.getArValue(this.state.dropDownValue)}
                          id="input-group-dropdown-2"
                          data-qc="search-dropdown"
                        >
                          {this.props.dropDownKeys.map((key, index) =>
                            <Dropdown.Item key={index} data-qc={key} onClick={() => { this.setState({ dropDownValue: key }); formikProps.setFieldValue('keyword', '') }}>{this.getArValue(key)}</Dropdown.Item>
                            )}
                        </DropdownButton>
                        : null }
                      </InputGroup>
                    </Col>
                  );
                }
                if (searchKey === 'dateFromTo') {
                  return (
                    <Col key={index} sm={6}>
                      <div className="dropdown-container" style={{ flex: 1, alignItems: 'center' }}>
                        <p className="dropdown-label" style={{ alignSelf: 'normal', marginLeft: 20, width: 400 }}>{this.props.datePlaceholder? this.props.datePlaceholder : local.creationDate}</p>
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
                        <Form.Control as="select" name="governorate" className="dropdown-select" data-qc="governorate" onChange={formikProps.handleChange}>
                          <option value="" data-qc="all">{local.all}</option>
                          {this.state.governorates.map((governorate, index) => {
                            return (<option key={index} value={governorate.governorateName.ar} data-qc={governorate.governorateName.ar}>
                              {governorate.governorateName.ar}</option>)
                          })}
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
                          <option value='pending' data-qc='pending'>{local.pending}</option>
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
                          <option value='secondReview' data-qc='secondReview'>{local.secondReviewed}</option>
                          <option value='thirdReview' data-qc='thirdReview'>{local.thirdReviewed}</option>
                          <option value='approved' data-qc='approved'>{local.approved}</option>
                          <option value='created' data-qc='created'>{local.created}</option>
                          <option value='rejected' data-qc='rejected'>{local.rejected}</option>
                          <option value='canceled' data-qc='canceled'>{local.cancelled}</option>
                        </Form.Control>
                      </div>
                    </Col>
                  )
                }
                if(searchKey === 'review-application') {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.status}</p>
                        <Form.Control as="select" className="dropdown-select" data-qc="status"  value={formikProps.values.status ? formikProps.values.status  : 'reviewed' } onChange={(e) => { formikProps.setFieldValue('status', e.currentTarget.value) }}>     
                           <option  value='reviewed' data-qc='reviewed'>{local.reviewed}</option>
                           <Can I="thirdReview" a="application">
                            <option value='secondReview' data-qc='secondReviewed'>{local.secondReviewed}</option>
                          </Can>
                        </Form.Control>
                      </div>
                    </Col>
                  )
                }
                if(searchKey==='clearance-status'){
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.status}</p>
                        <Form.Control as="select" className="dropdown-select" data-qc="status" value={formikProps.values.status} onChange={(e) => { formikProps.setFieldValue('status', e.currentTarget.value) }}>
                          <option value="" data-qc="all">{local.all}</option>
                          <option value='underReview' data-qc='underReview'>{local.underReview}</option>
                          <option value='approved' data-qc='approved'>{local.approved}</option>
                          <option value='rejected' data-qc='rejected'>{local.rejected}</option>
                        </Form.Control>
                      </div>
                    </Col>
                  )
                }
                if (searchKey === 'branch' && this.viewBranchDropdown()) {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <BranchesDropDown value={formikProps.values.branchId} onSelectBranch={(branch) => { formikProps.setFieldValue('branchId', branch._id) }} />
                    </Col>
                  )
                }
                if (searchKey === 'actions') {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <div className="dropdown-container">
                        <p className="dropdown-label">{local.transaction}</p>
                        <Form.Control as="select" className="dropdown-select" data-qc="actions" value={formikProps.values.action} onChange={(e) => { formikProps.setFieldValue('action', [e.currentTarget.value]) }}>
                          <option value="" data-qc="all">{local.all}</option>
                          {
                            this.state.actionsList.map((action,index)=>{
                               return(
                                <option key = {index} value= {action} data-qc ={action}>{action}</option>
                              );
                            })
                          }
                        </Form.Control>
                      </div>
                    </Col>
                  )
                }
                if (searchKey === 'doubtful') {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <Form.Group className="row-nowrap" controlId='doubtful'>
                        <Form.Check
                            type='checkbox'
                            name='isDoubtful'
                            data-qc='isDoubtfulCheck'
                            checked={formikProps.values.isDoubtful}
                            onChange={(e) => formikProps.setFieldValue('isDoubtful', e.currentTarget.checked)}
                            label={local.doubtfulLoans}
                            disabled={formikProps.values.isWrittenOff}
                        />
                    </Form.Group>
                    </Col>
                  )
                }
                if (searchKey === 'writtenOff') {
                  return (
                    <Col key={index} sm={6} style={{ marginTop: 20 }}>
                      <Form.Group className="row-nowrap" controlId='writtenOff'>
                        <Form.Check
                            type='checkbox'
                            name='isWrittenOff'
                            data-qc='isWrittenOffCheck'
                            checked={formikProps.values.isWrittenOff}
                            onChange={(e) => formikProps.setFieldValue('isWrittenOff', e.currentTarget.checked)}
                            label={local.writtenOffLoans}
                            disabled={formikProps.values.isDoubtful}
                        />
                    </Form.Group>
                    </Col>
                  )
                }
              })}
              
              <Col>
                <Button 
                  type="submit" 
                  style={{ width: 180, height: 50, marginTop: 20 }}
                  disabled={formikProps.values.fromDate ? !Boolean(formikProps.values.fromDate && formikProps.values.toDate) : false}
                >{local.search}</Button>
              </Col>
            </Row>
          </Form>
        }
      </Formik>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    issuedLoansSearchFilters: state.issuedLoansSearchFilters
  }
}
const addSearchToProps = dispatch => {
  return {
    search: data => dispatch(search(data)),
    searchFilters: data => dispatch(searchFilters(data)),
    setLoading: data => dispatch(loading(data)),
    setIssuedLoansSearchFilters: data => dispatch(issuedLoansSearchFilters(data)),
  };
};

export default connect(mapStateToProps, addSearchToProps)(Search);