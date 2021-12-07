import React, { FunctionComponent, useState } from 'react'
import Swal from 'sweetalert2'
import { getLoanComments } from 'Shared/Services/APIs/LoanComments/getLoanComments'
import { Loader } from 'Shared/Components/Loader'
import * as local from 'Shared/Assets/ar.json'
import { customFilterOption, getErrorMessage } from 'Shared/Services/utils'
import ability from 'Shared/config/ability'
import Button from 'react-bootstrap/Button'
import { LtsIcon } from 'Shared/Components'
import Table from 'react-bootstrap/Table'
import { setApplicationComments } from 'Shared/Services/APIs/LoanComments/addCommentToApplication'
import Modal from 'react-bootstrap/esm/Modal'
import Select from 'react-select'
import { theme } from 'Shared/theme'

interface LoanProfileCommentsProps {
  comments: string[]
  applicationId: string
  recallAPI: () => void
}
const LoanProfileComments: FunctionComponent<LoanProfileCommentsProps> = (
  props: LoanProfileCommentsProps
) => {
  const [selectedLoanComments, setSelectedLoanComments] = useState<
    { value: string; label: string }[]
  >()
  const [allLoanComments, setAllLoanComments] = useState<object[]>()
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const getComments = async () => {
    setLoading(true)
    const res = await getLoanComments()
    if (res.status === 'success') {
      const labeldComments: Array<object> = []
      res.body.reviewNotes
        .filter((note) => !props.comments.includes(note.name))
        .forEach((note) => {
          labeldComments.push({
            label: note.name,
            value: note.id,
          })
        })
      setLoading(false)
      setAllLoanComments(labeldComments)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  // useEffect(() => {
  //   getComments()
  // }, [])

  const setLoanApplicationComments = async (comments) => {
    setLoading(true)
    const res = await setApplicationComments(props.applicationId, comments)
    if (res.status === 'success') {
      setLoading(false)
      props.recallAPI()
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }
  const removeLoanApplicationComments = (comment) => {
    console.log(comment)
  }

  const addComments = () => {
    const selected = selectedLoanComments?.map((comment) => comment.label)
    setLoanApplicationComments(selected)
  }
  // const array = manageLoanDetailsArray()

  const canChangeComments = ability.can('addCustomerGuarantors', 'customer')
  return (
    <>
      <Loader type="fullscreen" open={loading} />
      <div className="d-flex flex-column align-items-start justify-content-center">
        {canChangeComments && (
          <div className="mt-5 mb-5">
            <Button
              variant="primary"
              onClick={async () => {
                await getComments()
                setOpenModal(true)
              }}
            >
              {local.addEditOrRemoveGuarantor}
            </Button>
          </div>
        )}
        {props.comments.length ? (
          <Table style={{ textAlign: 'right' }}>
            <thead>
              <tr>
                <th />
                <th>{local.comments}</th>
              </tr>
            </thead>
            <tbody>
              {props.comments.length &&
                props.comments.map((comment, index) => {
                  return (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{comment}</td>
                      {canChangeComments && (
                        <td style={{ padding: 10 }}>
                          <Button
                            variant="default"
                            onClick={() =>
                              removeLoanApplicationComments(comment)
                            }
                            title={local.delete}
                          >
                            <LtsIcon name="trash" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        ) : (
          <p>{local.noGuarantors}</p>
        )}
      </div>
      {openModal && (
        <Modal size="lg" show={openModal} onHide={() => setOpenModal(false)}>
          <Loader type="fullsection" open={loading} />
          <Modal.Header>
            <Modal.Title>
              {local.add}
              {local.comments}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Select
              styles={theme.selectStyleWithBorder}
              theme={theme.selectTheme}
              isMulti
              isSearchable
              filterOption={customFilterOption}
              placeholder={
                <span style={{ width: '100%', padding: '5px', margin: '5px' }}>
                  <LtsIcon name="search" />

                  {local.searchByUserRole}
                </span>
              }
              name="roles"
              data-qc="roles"
              onChange={(event: any) => {
                console.log(event)
                setSelectedLoanComments(event)
              }}
              value={selectedLoanComments}
              options={allLoanComments}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setOpenModal(false)
              }}
            >
              {local.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={() => addComments()}
              disabled={!selectedLoanComments}
            >
              {local.submit}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default LoanProfileComments
