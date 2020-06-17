import React, { useState } from 'react';
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

interface Props {
  values: RolesBranchesValues;
  userRolesOptions: Array<object>;
  userBranchesOptions: Array<object>;
  handleSubmit: any;
  previousStep: any;
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
  const [hasBranch, setHasBranch] = useState(() => isHasBranch(props.values.roles));
  const [roles, setRoles] = useState(props.values.roles);
  const [branches, setBranches] = useState(props.values.branches);
  const [showRolesError, setShowRolesError] = useState(false);
  const [showBranchesError, setShowBranchesError] = useState(false);
  const handleChange = (list) => {
    if (hasBranch && list.length === 0) {
      setShowBranchesError(true);
    } else {
      setShowBranchesError(false);
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

      {hasBranch &&
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
      <Form.Group
        as={Row}
      >
        <Col >
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
