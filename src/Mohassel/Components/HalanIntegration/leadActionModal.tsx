import React, { useState } from 'react'
import local from 'Shared/Assets/ar.json'
import Modal from 'react-bootstrap/esm/Modal'
import Row from 'react-bootstrap/esm/Row'
import Form from 'react-bootstrap/esm/Form'
import AsyncSelect from 'react-select/async'
import { theme } from 'Shared/theme'
import Col from 'react-bootstrap/esm/Col'
import { Branch, LoanOfficer } from 'Shared/Services/interfaces'
import Button from 'react-bootstrap/esm/Button'
import { searchLoanOfficer } from 'Shared/Services/APIs/LoanOfficers/searchLoanOfficer'
import { assignLeadToLO } from 'Shared/Services/APIs/Leads/assignLeadToLO'
import Swal from 'sweetalert2'
import { searchBranches } from 'Shared/Services/APIs/Branch/searchBranches'
import { changeLeadBranch } from 'Shared/Services/APIs/Leads/changeLeadBranch'

// TODO add types
export const LeadActionModal = ({
  activeModal,
  setActiveModal,
  selectedLead,
  setSelectedLead,
  setIsLoading,
}) => {
  const [loanOfficers, setLoanOfficers] = useState<LoanOfficer[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>()

  const [
    selectedLoanOfficer,
    setSelectedLoanOfficer,
  ] = useState<LoanOfficer | null>(null)

  const getLoanOfficers = async (input: string) => {
    const res = await searchLoanOfficer({ from: 0, size: 1000, name: input })
    if (res.status === 'success') {
      setLoanOfficers(res.body.data)
      return res.body.data
        .filter((loanOfficer) =>
          loanOfficer.branches?.includes(selectedLead.branchId)
        )
        .filter((loanOfficer) => loanOfficer.status === 'active')
        .filter((loanOfficer) => loanOfficer._id !== selectedLead.loanOfficerId)
    }
    setLoanOfficers([])
    return []
  }
  const getBranches = async (input: string) => {
    const res = await searchBranches({ from: 0, size: 1000, name: input })
    if (res.status === 'success') {
      setBranches(res.body.data)
      return res.body.data.filter(
        (branch) => branch._id !== selectedLead.branchId
      )
    }
    setBranches([])
    return []
  }

  const submitLOChange = async () => {
    setIsLoading(true)
    const res = await assignLeadToLO(
      selectedLead.phoneNumber,
      selectedLoanOfficer?._id || '',
      selectedLead.uuid
    )
    if (res.status === 'success') {
      setIsLoading(false)
      setActiveModal('')
      Swal.fire({
        text: `${local.doneMoving} ${local.customerSuccess}`,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => {
        setSelectedLoanOfficer(null)
        setSelectedLead({})
      })
    } else {
      setIsLoading(false)
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: local.errorOnMovingCustomers,
        icon: 'error',
      })
    }
  }
  const submitBranchChange = async () => {
    setIsLoading(true)
    const res = await changeLeadBranch(
      selectedLead.phoneNumber,
      selectedBranch?._id || '',
      selectedLead.uuid
    )
    if (res.status === 'success') {
      setIsLoading(false)
      setActiveModal('')
      Swal.fire({
        text: `${local.doneMoving} ${local.customerSuccess}`,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => {
        setSelectedBranch(null)
        setSelectedLead({})
      })
    } else {
      setIsLoading(false)
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: local.errorOnMovingCustomers,
        icon: 'error',
      })
    }
  }
  // TODO add types
  const leadsModals = {
    loanOfficer: {
      title: local.chooseRepresentative,
      value: loanOfficers,
      selectedValue: selectedLoanOfficer,
      setSelectedValue: setSelectedLoanOfficer,
      getValues: getLoanOfficers,
      onSubmit: submitLOChange,
    },
    branch: {
      title: local.chooseBranch,
      value: branches,
      selectedValue: selectedBranch,
      setSelectedValue: setSelectedBranch,
      getValues: getBranches,
      onSubmit: submitBranchChange,
    },
  }
  return (
    <Modal size="lg" show onHide={() => setActiveModal('')}>
      <Modal.Header>
        <Modal.Title className="m-auto">
          {leadsModals[activeModal].title}
        </Modal.Title>
        <button
          type="button"
          className="mr-0 pr-0 close"
          onClick={() => setActiveModal('')}
        >
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </button>
      </Modal.Header>
      <Modal.Body>
        <Row className="p-4">
          <Form.Label className="data-label">
            {leadsModals[activeModal].title}
          </Form.Label>
          <Col sm={12} className="p-0">
            <AsyncSelect
              name="employees"
              data-qc="employees"
              styles={theme.selectStyleWithBorder}
              theme={theme.selectTheme}
              value={leadsModals[activeModal].value.find(
                (option) =>
                  option._id === leadsModals[activeModal].selectedValue?._id
              )}
              onChange={(newValue) =>
                newValue && leadsModals[activeModal].setSelectedValue(newValue)
              }
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option._id}
              loadOptions={(input) => leadsModals[activeModal].getValues(input)}
              cacheOptions
              defaultOptions
            />
          </Col>
        </Row>
        <Col>
          <Button
            className="mt-4 w-100"
            onClick={() => leadsModals[activeModal].onSubmit()}
            disabled={false}
            variant="primary"
          >
            {local.submit}
          </Button>
        </Col>
      </Modal.Body>
    </Modal>
  )
}
