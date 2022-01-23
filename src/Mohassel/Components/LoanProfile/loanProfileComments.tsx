import React, { FunctionComponent, useState } from 'react'
import Swal from 'sweetalert2'
import { getLoanComments } from 'Shared/Services/APIs/LoanComments/getLoanComments'
import { Loader } from 'Shared/Components/Loader'
import * as local from 'Shared/Assets/ar.json'
import {
  customFilterOption,
  getErrorMessage,
  numbersToArabic,
} from 'Shared/Services/utils'
import ability from 'Shared/config/ability'
import Button from 'react-bootstrap/Button'
import { LtsIcon } from 'Shared/Components'
import Table from 'react-bootstrap/Table'
import { setApplicationComments } from 'Shared/Services/APIs/LoanComments/addCommentToApplication'
import Modal from 'react-bootstrap/esm/Modal'
import Select from 'react-select'
import { theme } from 'Shared/theme'
import { OptionType } from 'Shared/Components/dropDowns/types'
import Can from '../../config/Can'

interface LoanProfileCommentsProps {
  comments: string[]
  applicationId: string
  recallAPI: () => void
  applicationStatus: string
  getCommentsReport: (key: string) => void
  applicationKey: number
}

const LoanProfileComments: FunctionComponent<LoanProfileCommentsProps> = (
  props: LoanProfileCommentsProps
) => {
  const [selectedLoanComments, setSelectedLoanComments] = useState<
    OptionType[]
  >([])
  const [allLoanComments, setAllLoanComments] = useState<OptionType[]>()
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const getComments = async () => {
    setLoading(true)
    const res = await getLoanComments()
    if (res.status === 'success') {
      const labeldComments: Array<OptionType> = []
      res.body.reviewNotes
        .filter((note) => !props.comments.includes(note.name) && note.activated)
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
      Swal.fire(local.error, getErrorMessage(res.error.error), 'error')
    }
  }

  const setLoanApplicationComments = async (comments) => {
    setLoading(true)
    const res = await setApplicationComments(props.applicationId, comments)
    if (res.status === 'success') {
      setLoading(false)
      props.recallAPI()
    } else {
      setLoading(false)
      Swal.fire(local.error, getErrorMessage(res.error.error), 'error')
    }
  }
  const removeLoanApplicationComments = (commentToRemove) => {
    const comments = props.comments.filter(
      (comment) => comment !== commentToRemove
    )
    setLoanApplicationComments(comments)
  }

  const addComments = () => {
    const selected = selectedLoanComments?.map((comment) => comment.label)
    setLoanApplicationComments([...props.comments, ...selected])
  }

  const canChangeComments =
    ability.can('assignLoanReviewNote', 'application') &&
    !['pending', 'paid', 'canceled', 'issued', 'rejected', 'created'].includes(
      props.applicationStatus
    )

  const handleCommentsReport = () => {
    props.getCommentsReport(props.applicationKey.toString())
  }

  return (
    <>
      <Loader type="fullscreen" open={loading} />
      <div className="d-flex flex-column align-items-start justify-content-center">
        <div className="d-flex">
          {canChangeComments && (
            <div className="mt-5 mb-5 mr-5">
              <Button
                variant="primary"
                onClick={async () => {
                  await getComments()
                  setOpenModal(true)
                }}
              >
                {local.add} {local.comments}
              </Button>
            </div>
          )}
          {!['canceled'].includes(props.applicationStatus) && (
            <Can I="getLoanApplicationsNotes" a="report-2">
              <div className="mt-5 mb-5">
                <Button
                  variant="primary"
                  onClick={() => handleCommentsReport()}
                >
                  {local.commentsReport}
                </Button>
              </div>
            </Can>
          )}
        </div>
        {props.comments.length ? (
          <Table className="text-left">
            <thead>
              <tr>
                <th />
                <th>{local.comments}</th>
                {canChangeComments && <th>{local.delete}</th>}
              </tr>
            </thead>
            <tbody>
              {props.comments.length &&
                props.comments.map((comment, index) => {
                  return (
                    <tr key={index}>
                      <td>{numbersToArabic(index + 1)}</td>
                      <td className="text-break">{comment}</td>
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
          <p>
            {local.na} {local.comments}
          </p>
        )}
      </div>
      {openModal && (
        <Modal size="lg" show={openModal} onHide={() => setOpenModal(false)}>
          <Loader type="fullsection" open={loading} />
          <Modal.Header>
            <Modal.Title>
              <>
                {local.add} {local.comments}
              </>
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
                  {local.search}
                </span>
              }
              name="comments"
              data-qc="comments"
              onChange={(event: any) => {
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
                setSelectedLoanComments([])
              }}
            >
              {local.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={() => addComments()}
              disabled={!selectedLoanComments?.length}
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
