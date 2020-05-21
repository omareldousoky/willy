import React,{useState} from 'react';
import './userCreation.scss';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import Select from 'react-select';
import {theme} from '../../../theme';
import {RolesBranchesValues} from './userCreationinterfaces';
import DualBox from '../DualListBox/dualListBox';
import Swal from 'sweetalert2';

interface Props{
    values: RolesBranchesValues;
    userRolesOptions: Array<object>;
    userBranchesOptions: Array<object>;
    handleSubmit: any;
    handleBlur?: any;
    handleChange?: any;
    previousStep: any;
}
  const isHasBranch = (roles: Array<any>): boolean => {
     let rolesState = false ;
       roles?.map(role=> {
        console.log(role)
        if(role.hasBranch===true){
       rolesState  =true;
          return;
        }
      }) 
     return rolesState;
  }
const style = {
    control: base => ({
        ...base,
        "&:hover": { borderColor: theme.colors.primary }, // border style on hover
        border: `1px solid ${theme.colors.veryLightGray}`, // default border color
        boxShadow: "none" // no box-shadow
      }),
      menu: (base, state) => ({
        ...base,
        border: `1px solid ${theme.colors.veryLightGray}`,
      }),
      menuList: base => ({
        ...base,
        backgroundColor: theme.colors.basicBackground,
      }),
      //#a3a3a3
      multiValue: base => ({
        ...base,
        backgroundColor: theme.colors.veryLightGray,
        color: "#a3a3a3",
        borderRadius: "20px"
      }),
      multiValueRemove: base => ({
        ...base,
        "&:hover": {
          backgroundColor: theme.colors.primaryLight,
          color:theme.colors.primary,
        }
      }),
      multiValueLabel: base => ({
          ...base,
          color: theme.colors.blackText,
      }),
      option: (base, state) => ({
        ...base,
        color: theme.colors.blackText,
        "&:hover": { backgroundColor: theme.colors.primaryLight },
        backgroundColor: state.isFocused ? theme.colors.basicBackground : "inhert",
        "&:active": { backgroundColor: theme.colors.primary }
      })
    };

  
const UserRolesAndPermisonsFrom = (props: Props) => {
  
  const [hasBranch, setHasBranch] = useState(()=>isHasBranch(props.values.roles));
  const [roles, setRoles] = useState(props.values.roles);
  const [showRolesError,setShowRolesError] = useState(false);

  const  handleRolesChange = () =>{
    if(!props.values.roles || props.values.roles.length===0) {
      setShowRolesError(true);
    } else {
      setShowRolesError(false);
    }
   
  }
const customFilterOption = (option, rawInput) => {
  if(option.label) {
  const words = rawInput.split(' ');
  return words.reduce(
    (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
    true,
  );
  }
};

    return (
        <Form
            className="user-role-form"
            onSubmit={props.handleSubmit}
        >
            <Form.Group
                className={'user-role-group'}
                controlId='roles'
            >
                <Form.Label 
                  className={'user-role-label'}
                >{local.selectUserPermision}</Form.Label>
                <Select
                styles={style}
                    isMulti
                    isSearchable = {true}
                    filterOption = {customFilterOption}
                    placeholder={<span style={{width:'100%',padding:"5px", margin:"5px"}}><img style={{float:"right"}} alt="search-icon" src={require('../../Assets/searchIcon.svg')}/> {local.searchByUserRole}</span>}
                    name="roles"
                    data-qc="roles"
                    onChange= { 
                        (event: any) => { 
                          
                          props.values.roles = event ;
                          setRoles(event);
                         setHasBranch(isHasBranch(event))
                       if(!hasBranch){
                         props.values.branches = [];
      
                       }
                       handleRolesChange();
                      }

                    }
                    value = {roles}
                    onBlur={props.handleBlur}
                    options = {props.userRolesOptions}
                />
            { showRolesError &&
         <div style={{color:'red',fontSize:'15px',margin:'10px' }}>{local.rolesIsRequired}</div> }
           </Form.Group>

        {hasBranch &&
       <Form.Group
        className={'user-role-group'}
        controlId={'branches'}
       >
           <Form.Label
            className={'user-role-label'}
           >{local.branch}</Form.Label>
            <DualBox
            labelKey={"branchName"}
            filterKey={'noKey'}
            selected = {props.values.branches}
            onChange={
              (list)=>{  props.values.branches = list;} } 
            rightHeader={local.allBranches}
            leftHeader = {local.selectedBranches}
            options = {props.userBranchesOptions}
             />
       </Form.Group>
}
       <Form.Group 
            as={Row}
            >
                <Col >
                    <Button 
                    className ={'btn-cancel-prev'} style={{ width:'60%' }} 
                     data-qc="previous"
                     onClick = {()=>{props.previousStep(props.values)}}
                      >{local.previous}</Button>
                </Col>
                <Col>
                    <Button disabled ={showRolesError|| props.values.roles.length === 0}  onClick =  {props.handleSubmit}  className= {'btn-submit-next'} style={{ float :'left',width:'60%' }} type="button" data-qc="submit">{local.submit}</Button>
                </Col>
            </Form.Group>
        </Form>
                  
    )
}

export default UserRolesAndPermisonsFrom;
