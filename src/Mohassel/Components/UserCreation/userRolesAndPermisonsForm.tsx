import React, { useState , useEffect } from 'react';
import './userCreation.scss';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as local from '../../../Shared/Assets/ar.json';
import Select from 'react-select';
import { theme } from '../../../theme';
import { RolesBranchesValues } from './userCreationinterfaces';
import DualBox from '../DualListBox/dualListBox';
import Container from 'react-bootstrap/Container';
import {searchUsers} from '../../Services/APIs/Users/searchUsers';

interface Props {
  values: RolesBranchesValues;
  userRolesOptions: Array<object>;
  userBranchesOptions: Array<object>;
  handleSubmit: any;
  previousStep: any;
  edit: boolean;
}

const isHasBranch = (roles: Array<any>): boolean => {
  let rolesState = false;
  roles?.map(role => {
    if (role.hasBranch === true) {
      rolesState = true;
      return;
    }
  })
  return rolesState;
}

const UserRolesAndPermisonsFrom = (props: Props) => {

 const checksInitials: any[] = [];
 let mangerRoleInitial = "";
   props.values.roles?.map((role)=> {
    if(role.value=== props.values.mainRoleId){
      mangerRoleInitial = role.managerRole;
        checksInitials.push(true)
    } else{
      checksInitials.push(false);
    }
  })
  const [hasBranch, setHasBranch] = useState(() => isHasBranch(props.values.roles));
  const [roles, setRoles] = useState(props.values.roles);
  const [branches, setBranches] = useState(props.values.branches);
  const [showRolesError, setShowRolesError] = useState(false);
  const [showBranchesError, setShowBranchesError] = useState(false);
  const [mainRoleCheck, setMainRoleCheck] = useState<Array<any>>(checksInitials);
  const [mainBranchId, setMainBranchId] = useState(props.values.mainBranchId);
  const [mainRoleId,  setMainRoleId] = useState(props.values.mainRoleId);
  const [mangerRole, setMangerRole] = useState(mangerRoleInitial);
  const [manager, setMangerId] = useState(props.values.manager);
  const [managersList, setMangersList] = useState<Array<any>> ([]);
    const handleChange = (list) => {
    if (hasBranch && list.length === 0) {
      setShowBranchesError(true);
    } else {
      setShowBranchesError(false);
      (list)
      setBranches(list)
      props.values.branches = list;
    }

  }
  const customFilterOption = (option, rawInput) => {
    if (option.label) {
      const words = rawInput.split(' ');
      return words.reduce(
        (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
        true,
      );
    }
  };
  

  const getMangersList = async (managerRoleId: string) => {
    if (!props.edit && managerRoleId){
    const obj = {
      status: 'active',
      roleId: managerRoleId,
      from: 0,
      size: 200,
    }
     const res = await searchUsers(obj);
     const users: any[] = [];  
     res.body.data.map((user: any)=> {
       users.push({
         label: user.name,
         value: user._id,
       })
     })
     setMangersList(users);
    }   
  }
   
  useEffect(() => {
       getMangersList(mangerRole);
}, [mangerRole]);


  return (
    <Container
      className="user-role-form"

    >
      <Form.Group
        className={'user-role-group'}
        controlId='roles'
      >
        <Form.Label
          className={'user-role-label'}
        >{local.selectUserPermision}</Form.Label>
        <Select
          styles={theme.selectStyle}
          isMulti
          isSearchable={true}
          filterOption={customFilterOption}
          placeholder={<span style={{ width: '100%', padding: "5px", margin: "5px" }}><img style={{ float: "right" }} alt="search-icon" src={require('../../Assets/searchIcon.svg')} /> {local.searchByUserRole}</span>}
          name="roles"
          data-qc="roles"
          onChange={
            (event: any) => {

              props.values.roles = event;
              setRoles(event);
              const checks: boolean[]= [];
              event.map(e =>{
                checks.push(false);
              })
               setMainRoleCheck(checks);
              setHasBranch(isHasBranch(event))
              if (!hasBranch) {
                props.values.branches = [];
                setShowBranchesError(false);
              }
              setShowRolesError(!props.values.roles || props.values.roles.length === 0);
            }


          }
          value={roles}
          options={props.userRolesOptions}
        />
        {showRolesError &&
          <div style={{ color: 'red', fontSize: '15px', margin: '10px' }}>{local.rolesIsRequired}</div>}
      </Form.Group>
      {!props.edit && roles.length > 0 &&
      <Form.Group className="user-role-group" controlId="mainRole" style={{ border: "1px solid #e5e5e5",backgroundColor:"#f7fff2", padding: "5px",}}>
          {
            roles.map((role,index)=>{
               return (
         <div key={index}  className={index ===(roles.length -1 )? "row-nowrap" : "row-nowrap border-bottom"} style={{width: '100%',marginTop:"5px"}}>
                 <Col>
                 <div className= {"row-nowrap"} style ={{height: '50px'}}>
                   <Form.Label className="">{local.roleName}</Form.Label>
                   <Form.Label className="" >{role.label}</Form.Label>
                   </div>
                  </Col>
                  <Col>
                  <Row className="row-nowrap"> 
                 <Form.Check 
                 key={index}
                 checked = {mainRoleCheck[index]}
                 value = {props.values.mainRoleId}
                 onChange = {(e)=>{
                   const checks: any[] = [];
                   mainRoleCheck.map((check, i)=>{
                     if(i === index){
                       checks.push(true);
                       setMainRoleId(role.value)
                       setMainRoleId(role.value);
                       props.values.mainRoleId = role.value;
                       setMangerRole(role.managerRole);
                     
                     } else {
                       checks.push(false);
                     }
                      
                   })
                
                   setMainRoleCheck(checks);
                 }
                 }
                 type = "radio"
                 />
               <Form.Label className={""}>{local.chooseAsMainRole}</Form.Label>
                 </Row>
                 </Col>
          </div>
               )
            })
          }
        </Form.Group>
}
      {hasBranch &&
        <Form.Group
          className={'user-role-group'}
          controlId={'branches'}
        >
          <Form.Label
            className={'user-role-label'}
          >{local.branch}</Form.Label>
          {showBranchesError &&
            <div style={{ color: 'red', fontSize: '15px', margin: '10px' }}>{local.branchIsRquired}</div>}
          <DualBox
            labelKey={"branchName"}
            filterKey={'noKey'}
            selected={props.values.branches}
            onChange={
              (list) => {
                handleChange(list);

              }

            }
            rightHeader={local.allBranches}
            leftHeader={local.selectedBranches}
            options={props.userBranchesOptions}
          />
        </Form.Group>
      }
   {!props.edit && branches.length > 0 &&
      <Form.Group controlId = "mainBranch">
        <Form.Label>
           {local.chooseMainBranch}
        </Form.Label>
        <Select 
         styles={theme.selectStyle}
         isSearchable={true}
         filterOption={customFilterOption}
         placeholder={<span style={{ width: '100%', padding: "5px", margin: "5px" }}><img style={{ float: "right" }} alt="search-icon" src={require('../../Assets/searchIcon.svg')} /> {local.searchByBranch}</span>}
         name="mainBranch"
         data-qc="mainBranch"
         options= {branches.map(branch=>{
           return {
             label: branch.branchName,
             value: branch._id
           }
         })}
         onChange = {(e: any) => {
           props.values.mainBranchId = e.value;
           setMainBranchId(e.value);
         }

         }
        />
        
      </Form.Group>
      }
      {!props.edit && managersList.length > 0 &&
      <Form.Group controlId="manager">
        <Form.Label>
           {local.chooseManager}
        </Form.Label>
        <Select 
         styles={theme.selectStyle}
         isSearchable={true}
         filterOption={customFilterOption}
         placeholder={<span style={{ width: '100%', padding: "5px", margin: "5px" }}><img style={{ float: "right" }} alt="search-icon" src={require('../../Assets/searchIcon.svg')} /> {local.chooseManager}</span>}
         name="manager"
         value = {manager}
         data-qc="manager"
         options= {managersList}
         onChange = {(e: any) => {
            setMangerId(e.value)
            props.values.manager = e.value;
         }

         }
        />
        
      </Form.Group>
      }
      <Form.Group
        as={Row}
      >
        <Col>
          <Button
            className={'btn-cancel-prev'} style={{ width: '60%' }}
            data-qc="previous"
            onClick={() => { props.previousStep(props.values) }}
          >{local.previous}</Button>
        </Col>
        <Col>
          <Button
            disabled={showRolesError || roles.length === 0 || (hasBranch && branches.length === 0) || showBranchesError}
            className={'btn-submit-next'} style={{ float: 'left', width: '60%' }}
            type="button"
            onClick={props.handleSubmit}
            data-qc="submit">{local.submit}</Button>
        </Col>
      </Form.Group>
    </Container>

  )
}

export default UserRolesAndPermisonsFrom;
