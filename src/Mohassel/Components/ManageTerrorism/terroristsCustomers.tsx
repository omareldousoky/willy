import React, {useState} from 'react'
import { Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import * as local from '../../../Shared/Assets/ar.json'
import { Loader } from '../../../Shared/Components/Loader'
import { DownloadAsCsv, getErrorMessage } from '../../../Shared/Services/utils'
import Can from '../../config/Can'
import { downloadSuspectsReport } from '../../Services/APIs/Terrorism/terrorism'
import { fullEnglishDate } from './terrorismInitials'
export const TerroristsCustomers = () => {
  const [loading, setLoading] =useState(false)
  const downloadSuspectsList = async () => {
    setLoading(true)
    const name = `suspectedTerroristsCustomers`
    const res = await downloadSuspectsReport()
    if (res.status == 'success' && res.body) {
          DownloadAsCsv(name,res.body)
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error),'error')
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
