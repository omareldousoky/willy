import React, { FunctionComponent, useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

import Swal from 'sweetalert2'
import * as local from '../../../Shared/Assets/ar.json'
import { updateOfficersGroups } from '../../../Mohassel/Services/APIs/ManagerHierarchy/updateOfficersGroups'
import { getOfficersGroups } from '../../../Mohassel/Services/APIs/ManagerHierarchy/getOfficersGroups'
import ability from '../../../Shared/config/ability'
import { Loader } from '../../../Shared/Components/Loader'
import { createOfficersGroups } from '../../../Mohassel/Services/APIs/ManagerHierarchy/createOfficersGroups'
import { getErrorMessage } from '../../../Shared/Services/utils'
import {
  LoanOfficer,
  ManagerHierarchyUser,
  OfficersGroup,
} from '../../../Shared/Services/interfaces'
import { searchUsers } from '../../../Shared/Services/APIs/Users/searchUsers'
import { searchLoanOfficer } from '../../../Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import { Group, SupervisionLevelsCreationProps } from './types'
import { SupervisionGroup } from './supervisionGroup'
import { LtsIcon } from '../../../Shared/Components'

export const SupervisionLevelsCreation: FunctionComponent<SupervisionLevelsCreationProps> = ({
  branchId,
  mode,
}) => {
  const [loading, setLoading] = useState(false)
  const [loanOfficers, setLoanOfficers] = useState<LoanOfficer[]>([])
  const [users, setUsers] = useState<LoanOfficer[]>([])
  const [groups, setGroups] = useState<OfficersGroup[]>([])

  const emptyGroup = {
    leader: { id: '', name: '' },
    officers: [],
  }

  const resetState = () => {
    setLoanOfficers([])
    setUsers([])
    setGroups([])
  }

  const getLoanOfficers = async () => {
    setLoading(true)
    const query = { from: 0, size: 500 }
    const officerQuery = { ...query, branchId }
    const res = await searchLoanOfficer(officerQuery)
    if (res.status === 'success' && res.body.data) {
      setLoanOfficers(res.body.data)
    }
    setLoading(false)
  }

  const getGroups = async () => {
    setLoading(true)
    const res = await getOfficersGroups(branchId)
    if (res.status === 'success') {
      if (res.body.data && mode === 'edit') {
        const data =
          res.body.data.groups?.filter((group) => group.status === 'pending') ||
          []
        setGroups(data)
      }
    } else {
      Swal.fire({
        title: local.errorTitle,
        text: getErrorMessage(res.error.error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
    }
    setLoading(false)
  }

  const getUsers = async () => {
    setLoading(true)
    const query = {
      from: 0,
      size: 500,
      status: 'active',
      branchId,
    }
    const res = await searchUsers(query)
    if (res.status === 'success' && res.body.data) {
      setUsers(res.body.data)
    }
    setLoading(false)
  }

  const initialState = async () => {
    resetState()
    await getUsers()
    await getLoanOfficers()
    if (mode === 'edit') {
      await getGroups()
    }
  }

  useEffect(() => {
    setLoading(true)
    initialState()
  }, [])

  useEffect(() => {
    setLoading(true)
    initialState()
  }, [mode])

  const removeGroup = (index) => {
    setGroups(groups.filter((_item, i) => index !== i))
  }

  const prepareGroups = () => {
    const groupsToSubmit: Group[] = []
    groups?.map((group) => {
      if (group.id && mode === 'edit') {
        groupsToSubmit.push({
          id: group.id,
          leader: group.leader.id,
          officers: group.officers
            ? group.officers
                .filter((officer) => officer.id)
                .map((officer) => officer.id)
            : [],
        })
      } else if (mode === 'create') {
        groupsToSubmit.push({
          leader: group.leader.id,
          officers: group.officers
            ? group.officers
                .filter((officer) => officer.id)
                .map((officer) => officer.id)
            : [],
        })
      }
    })
    return groupsToSubmit
  }

  const submit = async () => {
    if (mode === 'create') {
      const createOfficersGroupsData = {
        branchId,
        groups: prepareGroups(),
      }
      const res = await createOfficersGroups(createOfficersGroupsData)
      if (res.status === 'success') {
        Swal.fire({
          title: local.success,
          icon: 'success',
          confirmButtonText: local.confirmationText,
        }).then(() => window.location.reload())
      } else {
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      }
    } else if (mode === 'edit') {
      const updateOfficersGroupsData = {
        branchId,
        groups: prepareGroups(),
      }
      const res = await updateOfficersGroups(updateOfficersGroupsData, branchId)
      if (res.status === 'success') {
        Swal.fire({
          title: local.success,
          icon: 'success',
          confirmButtonText: local.confirmationText,
        }).then(() => window.location.reload())
      } else {
        Swal.fire({
          title: local.errorTitle,
          text: getErrorMessage(res.error.error),
          icon: 'error',
          confirmButtonText: local.confirmationText,
        })
      }
    }
  }

  const isCreate = mode === 'create'

  return (
    <>
      <Loader open={loading} type="fullscreen" />
      {(isCreate && users.length) || groups.length ? (
        <>
          {groups.map((item, index) => {
            return (
              <SupervisionGroup
                branchId={branchId}
                mode={mode}
                key={item.id}
                seqNo={index + 1}
                deleteGroup={() => removeGroup(index)}
                group={item}
                updateGroupOfficers={(newGroup: ManagerHierarchyUser[]) =>
                  setGroups(
                    groups.map((groupItem, i) =>
                      index === i
                        ? { ...groupItem, officers: newGroup }
                        : groupItem
                    )
                  )
                }
                updateGroupLeader={(newLeader?: ManagerHierarchyUser) => {
                  if (newLeader)
                    setGroups(
                      groups.map((groupItem, i) =>
                        index === i
                          ? { ...groupItem, leader: newLeader }
                          : groupItem
                      )
                    )
                }}
                users={users}
                loanOfficers={loanOfficers}
              />
            )
          })}
          {isCreate && users.length && (
            <Col className="pl-4">
              <Button
                type="button"
                variant="link"
                className="mr-auto my-5"
                onClick={() => setGroups(groups.concat(emptyGroup))}
              >
                <LtsIcon name="plus" color="#7dc255" />
                <span className="text-success pl-2 font-weight-bold">
                  {local.addGroupManager}
                </span>
              </Button>
            </Col>
          )}
          {(ability.can('createOfficersGroup', 'branch') ||
            ability.can('updateOfficersGroup', 'branch')) && (
            <Form.Group className="ml-4">
              <Button
                disabled={!groups.length}
                onClick={async () => {
                  await submit()
                }}
                className="px-5"
              >
                {isCreate
                  ? local.createSuperVisionGroups
                  : local.editSuperVisionGroups}
              </Button>
            </Form.Group>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img
            alt="no-data-found"
            src={require('../../../Shared/Assets/no-results-found.svg')}
          />
          <h4>{isCreate ? local.noUsersInBranch : local.noResultsFound}</h4>
        </div>
      )}
    </>
  )
}
