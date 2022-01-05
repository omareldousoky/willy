import React, { FunctionComponent, useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { UsersSearch } from 'Shared/Components/UsersSearch/UsersSearch'
import * as local from 'Shared/Assets/ar.json'
import { ManagerHierarchyUser } from 'Shared/Services/interfaces'
import './managerHierarchy.scss'
import { LtsIcon } from 'Shared/Components'
import { SupervisionGroupProps } from './types'

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
          <UsersSearch
            usersInitial={users}
            objectKey="leader"
            item={group.leader}
            updateItem={updateGroupLeader}
          />
        </Col>
        {mode === 'create' && (
          <Button type="button" variant="default" onClick={deleteGroup}>
            <span className="trash-icon" aria-hidden="true" />
          </Button>
        )}
      </div>
      <Row className="officers-container">
        {officers.map((officer, index) => {
          return (
            <Col key={index} sm={6}>
              <Form.Label className="supervision-label">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    setOfficers(officers.filter((_, i) => index !== i))
                  }}
                >
                  <LtsIcon name="remove" color="#d51b1b" />
                </Button>
                {local.loanOfficerOrCoordinator}
              </Form.Label>
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
            </Col>
          )
        })}
      </Row>
      {(mode === 'create' || mode === 'edit') && (
        <Button
          type="button"
          variant="link"
          disabled={!!officers.filter((officer) => !officer.id).length}
          onClick={() => {
            if (officers.filter((officer) => !officer.id).length) return
            setOfficers(officers.concat({ id: '', name: '' }))
          }}
        >
          <LtsIcon name="plus" color="#7dc255" />
          <span className="text-success pl-2 font-weight-bold">
            {local.addLoanOfficer}
          </span>
        </Button>
      )}
    </div>
  )
}
