import React, { Component } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Select from "react-select";
import { theme } from '../../../theme';
import * as local from '../../../Shared/Assets/ar.json'

const dropDownKeys = [
    'hrCode',
    'nationalId',
    'name',
]
const customFilterOption = (option, rawInput) => {
  if (option.value) {
    const words = rawInput.split(' ');
    return words.reduce(
      (acc, cur) => acc && option.value.toLowerCase().includes(cur.toLowerCase()),
      true,
    );
  }
};
interface State {
    dropDownValue: string;
    showError: boolean;
}
interface Props {
    usersOfBranch: any[];
    objectKey: any;
    item: any;
    disabled?: boolean;
}
class UsersSearch extends Component<Props, State> {
    constructor(props: Props){
            super(props);
            this.state = {
                dropDownValue:'hrCode',
                showError: false,
            }
    }
    getArValue(key: string) {
        switch (key) {
            case 'name': return local.name;
            case 'nationalId': return local.nationalId;
            case 'hrCode': return local.hrCode;
            default: return '';
        }
    } 
    checkError(){
      if(this.props.item[this.props.objectKey]==""){
        this.setState({showError:true})
      } else {
        this.setState({showError: false})
      }
    }
    render() {
        return (
          <>
                      <InputGroup className={'row-nowrap'}>
                      {dropDownKeys && dropDownKeys.length?
                        <DropdownButton
                          as={InputGroup.Append}
                          variant="outline-secondary"
                          title={this.getArValue(this.state.dropDownValue)}
                          id="input-group-dropdown-2"
                          data-qc="search-dropdown"
                        >
                          {dropDownKeys.map((key, index) =>
                            <Dropdown.Item key={index} data-qc={key} onClick={() => { this.setState({ dropDownValue: key });}}>{this.getArValue(key)}</Dropdown.Item>
                            )}
                        </DropdownButton>
                        : null }
                        <InputGroup.Append>
                          <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                        </InputGroup.Append>
                        <div style={{margin:0, width:"60%"}}>
                        <Select
                        onBlur = {()=>{
                          this.checkError();
                        }}
                        placeholder={local.searchUserBranchPlaceholder}
                        name = "users-branch"
                        data-qc = "users-branch"
                        styles={theme.selectStyle}
                        filterOption={customFilterOption}
                        getOptionValue ={(option)=>option[this.state.dropDownValue]}
                        getOptionLabel = {(option)=>option.name}
                        options={this.props.usersOfBranch}
                        isSearchable = {true}
                        onChange={(event)=>{
                            this.props.item[this.props.objectKey]=event._id;
                         const index =  this.props.usersOfBranch.findIndex((user)=> user._id === event._id)
                         this.props.usersOfBranch.splice(index,1);
                           this.checkError();
                        }}
                        value={this.props.usersOfBranch?.find(
                          (item) => item._id===this.props.item[this.props.objectKey]
                        )}
                        isDisabled= {this.props.disabled}
                        />
                        </div>
                      {this.state.showError &&<Form.Label className={'error-label'}>{local.required}</Form.Label>}
                      </InputGroup>
            </>
        )
    }
}

export default UsersSearch;
