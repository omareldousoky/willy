import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'

import Swal from 'sweetalert2'
import * as local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import { downloadFile, getErrorMessage } from '../../../Shared/Services/utils'
import Can from '../../../Shared/config/Can'
import { downloadSuspectsReport } from '../../../Shared/Services/APIs/Terrorism/terrorism'

export const TerroristsCustomers = () => {
  const [loading, setLoading] = useState(false)
  const downloadSuspectsList = async () => {
    setLoading(true)
    const res = await downloadSuspectsReport()
    if (res.status === 'success' && res.body.presignedUr) {
      downloadFile(res.body.presignedUr)
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
    <>
      <Loader type="fullscreen" open={loading} />
      <Can I="suspectedCustomers" a="report">
        <Button
          variant="outline-primary"
          className="big-button"
          onClick={downloadSuspectsList}
        >
          {local.downloadSuspected}
        </Button>
      </Can>
    </>
  )
}
