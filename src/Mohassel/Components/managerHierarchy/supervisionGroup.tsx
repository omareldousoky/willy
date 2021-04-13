import React, { FunctionComponent, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import * as local from '../../../Shared/Assets/ar.json'
import { ManagerHierarchyUser } from '../../../Shared/Services/interfaces'
import './managerHierarchy.scss'
import { SupervisionGroupProps } from './types'
import { UsersSearch } from './UsersSearch'

export const SupervisionGroup: FunctionComponent<SupervisionGroupProps> = ({
  seqNo,
  deleteGroup,
  group,
  branchId,
  mode,
  users,
  loanOfficers,
  updateGroupLeader,
  updateGroupOfficers,
}) => {
  const [officers, setOfficers] = useState<ManagerHierarchyUser[]>(
    group.officers
  )

  useEffect(() => {
    updateGroupOfficers(officers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officers])

  return (
    <div className="supervision-group-container">
      <div className="group-supervisor-row m-0">
        <Col sm={6}>
          <Form.Label
            className="supervision-label"
            as={Col}
          >{`${local.groupManager} ( ${seqNo} )`}</Form.Label>
          <Row>
            <UsersSearch
              usersInitial={users}
              objectKey="leader"
              item={group.leader}
              updateItem={updateGroupLeader}
            />
          </Row>
        </Col>
        {mode === 'create' && (
          <div onClick={deleteGroup}>
            <img
              alt="delete"
              src={require('../../../Shared/Assets/deleteIcon.svg')}
            />
          </div>
        )}
      </div>
      <Row className="officers-container">
        {officers.map((officer, index) => {
          return (
            <Col key={index} sm={6}>
              <Form.Label className="supervision-label">
                <img
                  onClick={() => {
                    setOfficers(
                      officers.filter((item) => item.id !== officer.id)
                    )
                  }}
                  alt="remove"
                  src={require('../../Assets/removeIcon.svg')}
                />
                {local.loanOfficerOrCoordinator}
              </Form.Label>
              <Row className="row-nowrap">
                <UsersSearch
                  isLoanOfficer
                  usersInitial={loanOfficers}
                  objectKey={index}
                  item={officer}
                  updateItem={(newOfficer) =>
                    setOfficers(
                      officers
                        .map((officerItem, i) =>
                          i === index ? newOfficer : officerItem
                        )
                        .filter((v) => !!v) as ManagerHierarchyUser[]
                    )
                  }
                  branchId={branchId}
                />
              </Row>
            </Col>
          )
        })}
      </Row>
      {(mode === 'create' || mode === 'edit') && (
        <Row className="add-member-container">
          <Button
            className="add-member"
            type="button"
            variant="link"
            disabled={!!officers.filter((officer) => !officer.id).length}
            onClick={() => {
              if (officers.filter((officer) => !officer.id).length) return
              setOfficers(officers.concat({ id: '', name: '' }))
            }}
          >
            <img
              className="green-add-icon"
              alt="add"
              src={require('../../Assets/greenAdd.svg')}
            />
            {local.addLoanOfficer}
          </Button>
        </Row>
      )}
    </div>
  )
}
