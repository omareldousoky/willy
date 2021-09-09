import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import * as local from '../../../Shared/Assets/ar.json'
import { LtsIcon } from '../../../Shared/Components'
import { calculatePenalties } from '../../../Shared/Services/APIs/clearance/calculatePenalties'
import { getErrorMessage } from '../../../Shared/Services/utils'

const PenaltyStrike = (props: { loanId: string }) => {
  const [penalty, setPenalty] = useState(0)
  const calculatePenalty = async (loanId: string) => {
    const res = await calculatePenalties({
      id: loanId,
      truthDate: new Date().getTime(),
    })
    if (res.status === 'success') {
      if (res.body && res.body.penalty) setPenalty(res.body.penalty)
    } else Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
  }
  useEffect(() => {
    calculatePenalty(props.loanId)
  }, [props.loanId])
  return (
    <>
      {penalty ? (
        <div className="error-container  mx-2 my-3">
          <LtsIcon name="warning" color="#d51b1b" />
          <h4>
            <span style={{ margin: '0 10px' }}> {local.penaltyMessage}</span>
            <span style={{ color: '#d51b1b' }}>{penalty}</span>
          </h4>
        </div>
      ) : null}
    </>
  )
}

export default PenaltyStrike
