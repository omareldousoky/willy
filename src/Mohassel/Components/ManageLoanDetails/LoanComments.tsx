import React, { FunctionComponent, useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getLoanComments } from 'Shared/Services/APIs/LoanComments/getLoanComments'
import { updateLoanComment } from 'Shared/Services/APIs/LoanComments/updateLoanComment'
import { addLoanComment } from 'Shared/Services/APIs/LoanComments/addLoanComment'
import { Loader } from 'Shared/Components/Loader'
import * as local from 'Shared/Assets/ar.json'
import HeaderWithCards from 'Shared/Components/HeaderWithCards/headerWithCards'
import { getErrorMessage } from 'Shared/Services/utils'
import { CRUDList } from 'Shared/Components/CRUDList/crudList'
import { manageLoanDetailsArray } from './manageLoanDetailsInitials'

interface LoanComment {
  name: string
  disabledUi: boolean
  id: string
  activated: boolean
}
const LoanComments: FunctionComponent = () => {
  const [loanComments, setLoanComments] = useState<LoanComment[]>([])
  const [loading, setLoading] = useState(false)

  const getComments = async () => {
    setLoading(true)
    const res = await getLoanComments()
    if (res.status === 'success') {
      const responseLoanComments = res.body.reviewNotes.map((usage) => ({
        ...usage,
        disabledUi: true,
      }))
      setLoading(false)
      setLoanComments(responseLoanComments.reverse())
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  useEffect(() => {
    getComments()
  }, [])

  const editLoanComment = async (id, name, active) => {
    setLoading(true)
    const res = await updateLoanComment(id, name, active)
    if (res.status === 'success') {
      setLoading(false)
      getComments()
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  const newLoanComment = async (name, activated) => {
    setLoading(true)
    const res = await addLoanComment({ name, activated })
    if (res.status === 'success') {
      setLoading(false)
      getComments()
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  const array = manageLoanDetailsArray()

  return (
    <>
      <Loader type="fullscreen" open={loading} />
      <HeaderWithCards
        header={local.loanUses}
        array={array}
        active={array
          .map((item) => {
            return item.icon
          })
          .indexOf('applications')}
      />
      <CRUDList
        source="loanComments"
        options={loanComments}
        newOption={(name, active) => {
          newLoanComment(name, active)
        }}
        updateOption={(id, name, active) => {
          editLoanComment(id, name, active)
        }}
        canCreate
        canEdit
      />
    </>
  )
}

export default LoanComments
