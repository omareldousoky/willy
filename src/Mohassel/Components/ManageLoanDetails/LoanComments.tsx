import React, { FunctionComponent, useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getLoanComments } from 'Shared/Services/APIs/LoanComments/getLoanComments'
import { updateLoanComment } from 'Shared/Services/APIs/LoanComments/updateLoanComment'
import { addLoanComment } from 'Shared/Services/APIs/LoanComments/addLoanComment'
import { Loader } from 'Shared/Components/Loader'
import * as local from 'Shared/Assets/ar.json'
import HeaderWithCards from 'Shared/Components/HeaderWithCards/headerWithCards'
import { getErrorMessage } from 'Shared/Services/utils'
import { CRUDList, CrudOption } from 'Shared/Components/CRUDList/crudList'
import { maxValue } from 'Shared/localUtils'
import { manageLoanDetailsArray } from './manageLoanDetailsInitials'

const LoanComments: FunctionComponent = () => {
  const [loanComments, setLoanComments] = useState<CrudOption[]>([])
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
    if (name.length > 2000) return Swal.fire('Error !', maxValue(2000), 'error')
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
        noMaxLength
      />
    </>
  )
}

export default LoanComments
