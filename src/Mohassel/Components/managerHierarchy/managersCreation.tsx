import React, { FunctionComponent, useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Swal from 'sweetalert2'
import { UsersSearch } from 'Shared/Components/UsersSearch/UsersSearch'
import * as local from 'Shared/Assets/ar.json'
import { Loader } from 'Shared/Components/Loader'
import { getErrorMessage } from 'Shared/Services/utils'
import { ManagerHierarchyUser } from 'Shared/Services/interfaces'
import { getManagerHierarchy } from '../../Services/APIs/ManagerHierarchy/getManagerHierarchy'
import { updateManagerHierarchy } from '../../Services/APIs/ManagerHierarchy/updateManagersHierarchy'
import Can from '../../config/Can'
import { Managers, ManagersCreationProps } from './types'

const ManagersCreation: FunctionComponent<ManagersCreationProps> = ({
  branchId,
}) => {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<Managers>({
    branchManager: { id: '', name: '' },
    operationsManager: { id: '', name: '' },
    areaManager: { id: '', name: '' },
    areaSupervisor: { id: '', name: '' },
    centerManager: { id: '', name: '' },
  })

  const getManagers = async () => {
    const res = await getManagerHierarchy(branchId)
    if (res.status === 'success' && res.body?.data) {
      const {
        operationsManager,
        areaManager,
        areaSupervisor,
        centerManager,
        branchManager,
      } = res.body.data
      const newValues = {
        operationsManager,
        areaManager,
        areaSupervisor,
        centerManager,
        branchManager,
      }
      setValues(newValues)
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getManagers()
  }, [])

  const prepareManagers = () => {
    return {
      operationsManager: values?.operationsManager?.id || undefined,
      areaManager: values?.areaManager?.id || undefined,
      areaSupervisor: values?.areaSupervisor?.id || undefined,
      centerManager: values?.centerManager?.id || undefined,
      branchManager: values?.branchManager?.id || undefined,
    }
  }

  const updateManagers = async () => {
    setLoading(true)
    const updateManagersData = prepareManagers()
    const res = await updateManagerHierarchy(updateManagersData, branchId)
    if (res.status === 'success') {
      Swal.fire('Success !', local.updateSuccess, 'success')
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
    setLoading(false)
  }

  return (
    <div>
      <Loader open={loading} type="fullscreen" />
      <Form className="managers-form">
        <Form.Group
          className="managers-form-group"
          as={Col}
          id="operationsManager"
        >
          <Form.Label className="managers-label">
            {local.operationsManager}
          </Form.Label>
          <Row>
            <UsersSearch
              usersInitial={[]}
              objectKey="operationsManager"
              item={values.operationsManager}
              updateItem={(newOperationsManager?: ManagerHierarchyUser) =>
                setValues({
                  ...values,
                  operationsManager: newOperationsManager,
                })
              }
              isClearable
            />
          </Row>
        </Form.Group>
        <Form.Group
          className="managers-form-group"
          as={Col}
          id="districtManager"
        >
          <Form.Label className="managers-label">
            {local.districtManager}
          </Form.Label>
          <Row>
            <UsersSearch
              isClearable
              usersInitial={[]}
              objectKey="districtManager"
              item={values.areaManager}
              updateItem={(newAreaManager?: ManagerHierarchyUser) =>
                setValues({
                  ...values,
                  areaManager: newAreaManager,
                })
              }
            />
          </Row>
        </Form.Group>
        <Form.Group
          className="managers-form-group"
          as={Col}
          id="districtSupervisor"
        >
          <Form.Label className="managers-label">
            {local.districtSupervisor}
          </Form.Label>
          <Row>
            <UsersSearch
              isClearable
              usersInitial={[]}
              objectKey="districtSupervisor"
              item={values.areaSupervisor}
              updateItem={(newAreaSupervisor?: ManagerHierarchyUser) =>
                setValues({
                  ...values,
                  areaSupervisor: newAreaSupervisor,
                })
              }
            />
          </Row>
        </Form.Group>
        <Form.Group className="managers-form-group" as={Col} id="centerManager">
          <Form.Label className="managers-label">
            {local.centerManager}
          </Form.Label>
          <Row>
            <UsersSearch
              isClearable
              usersInitial={[]}
              objectKey="centerManager"
              item={values.centerManager}
              updateItem={(newCenterManager?: ManagerHierarchyUser) =>
                setValues({
                  ...values,
                  centerManager: newCenterManager,
                })
              }
            />
          </Row>
        </Form.Group>
        <Form.Group className="managers-form-group" as={Col} id="branchManager">
          <Form.Label className="managers-label">
            {local.branchManager}
          </Form.Label>
          <Row>
            <UsersSearch
              isClearable
              usersInitial={[]}
              objectKey="branchManager"
              item={values.branchManager}
              updateItem={(newBranchManager?: ManagerHierarchyUser) =>
                setValues({
                  ...values,
                  branchManager: newBranchManager,
                })
              }
            />
          </Row>
        </Form.Group>
      </Form>
      <Can I="updateBranchManagersHierarchy" a="branch">
        <Form.Group>
          <Button
            className="save-button"
            onClick={async () => {
              await updateManagers()
            }}
          >
            {local.save}
          </Button>
        </Form.Group>
      </Can>
    </div>
  )
}

export default ManagersCreation
