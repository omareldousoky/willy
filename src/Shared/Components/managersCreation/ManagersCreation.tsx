import React, { FC, useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Swal from 'sweetalert2'
import * as local from '../../Assets/ar.json'
import { UsersSearch } from '../UsersSearch/UsersSearch'
import { getManagerHierarchy } from '../../Services/APIs/ManagerHierarchy/getManagerHierarchy'
import { updateManagerHierarchy } from '../../Services/APIs/ManagerHierarchy/updateManagersHierarchy'
import { Loader } from '../Loader'
import Can from '../../config/Can'
import { getErrorMessage } from '../../Services/utils'
import { Managers, ManagersCreationProps } from './types'
import { ManagerHierarchyUser } from '../../Services/interfaces'

const FormManagersCreation: FC<{
  label: string
  objectKeyId: string
  values: Managers
  setValues: (val: Managers) => void
  intialValue?: []
  value: ManagerHierarchyUser | undefined
}> = ({ label, values, intialValue = [], setValues, objectKeyId, value }) => {
  return (
    <Form.Group className="managers-form-group" as={Col} id={objectKeyId}>
      <Form.Label className="managers-label">{label}</Form.Label>
      <Row>
        <UsersSearch
          usersInitial={intialValue}
          objectKey={objectKeyId}
          item={value}
          updateItem={(val?: ManagerHierarchyUser) =>
            setValues({
              ...values,
              [objectKeyId]: val,
            })
          }
          isClearable
        />
      </Row>
    </Form.Group>
  )
}
const ManagersCreation: FC<ManagersCreationProps> = ({ branchId }) => {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<Managers>({
    branchManager: { id: '', name: '' },
    operationsManager: { id: '', name: '' },
    districtManager: { id: '', name: '' },
    districtSupervisor: { id: '', name: '' },
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
        districtManager: areaManager,
        districtSupervisor: areaSupervisor,
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
      areaManager: values?.districtManager?.id || undefined,
      areaSupervisor: values?.districtSupervisor?.id || undefined,
      centerManager: values?.centerManager?.id || undefined,
      branchManager: values?.branchManager?.id || undefined,
    }
  }

  const updateManagers = async () => {
    setLoading(true)
    const updateManagersData = prepareManagers()
    const res = await updateManagerHierarchy(updateManagersData, branchId)
    if (res.status === 'success') {
      Swal.fire({
        title: local.success,
        text: local.updateSuccess,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      })
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

  return (
    <div>
      <Loader open={loading} type="fullscreen" />
      <Form className="managers-form">
        <FormManagersCreation
          label={local.operationsManager}
          objectKeyId="operationsManager"
          setValues={setValues}
          values={values}
          value={values.operationsManager}
        />
        <FormManagersCreation
          label={local.districtManager}
          objectKeyId="districtManager"
          setValues={setValues}
          values={values}
          value={values?.districtManager}
        />
        <FormManagersCreation
          label={local.districtSupervisor}
          objectKeyId="districtSupervisor"
          setValues={setValues}
          values={values}
          value={values?.districtSupervisor}
        />
        <FormManagersCreation
          label={local.centerManager}
          objectKeyId="centerManager"
          setValues={setValues}
          values={values}
          value={values?.centerManager}
        />
        <FormManagersCreation
          label={local.branchManager}
          objectKeyId="branchManager"
          setValues={setValues}
          values={values}
          value={values?.branchManager}
        />
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

export default React.memo(ManagersCreation)
