import React, { CSSProperties } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import { SettlementExtraDetailsRespose } from 'Shared/Models/LegalAffairs'
import Table from 'react-bootstrap/Table'
import { theme } from 'Shared/theme'
import local from 'Shared/Assets/ar.json'

interface SettlementExtraDetailsModalProps {
  showModal: boolean
  setShowModal: (bool) => void
  resetData: () => void
  extraSettlementDetails: SettlementExtraDetailsRespose
}
const header: CSSProperties = {
  textAlign: 'right',
  fontSize: '14px',
  width: '25%',
  color: theme.colors.lightGrayText,
}
const cell: CSSProperties = {
  textAlign: 'right',
  padding: '10px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: theme.colors.blackText,
}
export const SettlementExtraDetailsModal = ({
  showModal,
  setShowModal,
  resetData,
  extraSettlementDetails,
}: SettlementExtraDetailsModalProps) => {
  const resetState = () => {
    resetData()
    setShowModal(false)
  }

  return (
    <Modal show={showModal} size="lg">
      <Modal.Header>
        <Modal.Title>{local.legalAffairs}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <tbody className="px-0 py-2">
            <tr>
              <td style={header}>{local.principalRemaining}</td>
              <td style={cell}>
                {extraSettlementDetails.principalRemaining || 0}
              </td>
            </tr>
            <tr>
              <td style={header}>{local.courtFees}</td>
              <td style={cell}>{extraSettlementDetails.courtFees || 0}</td>
            </tr>
            <tr>
              <td style={header}>{local.penaltiesPaid}</td>
              <td style={cell}>{extraSettlementDetails.penaltiesPaid || 0}</td>
            </tr>
            <tr>
              <td style={header}>{local.penaltiesCanceled}</td>
              <td style={cell}>
                {extraSettlementDetails.penaltiesCanceled || 0}
              </td>
            </tr>
            <tr>
              <td style={header}>{local.penaltiesRemaining}</td>
              <td style={cell}>
                {extraSettlementDetails.penaltiesRemaining || 0}
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => resetState()}>
          {local.cancel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
