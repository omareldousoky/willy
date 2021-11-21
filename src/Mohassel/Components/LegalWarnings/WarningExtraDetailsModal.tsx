import React, { CSSProperties } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import { WarningExtraDetailsRespose } from 'Shared/Models/LegalAffairs'
import Table from 'react-bootstrap/Table'
import { theme } from 'Shared/theme'
import local from '../../../Shared/Assets/ar.json'

import { timeToArabicDate } from '../../../Shared/Services/utils'

interface WarningExtraDetailsModalProps {
  showModal: boolean
  setShowModal: (bool) => void
  resetData: () => void
  extraWarningDetails: WarningExtraDetailsRespose
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
export const WarningExtraDetailsModal = ({
  showModal,
  setShowModal,
  resetData,
  extraWarningDetails,
}: WarningExtraDetailsModalProps) => {
  const resetState = () => {
    resetData()
    setShowModal(false)
  }

  return (
    <Modal show={showModal} size="lg">
      <Modal.Header>
        <Modal.Title>{local.warningForCustomer}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <tbody className="px-0 py-2">
            {extraWarningDetails.daysSinceLastUnpaidInstallments && (
              <tr>
                <td style={header}>{local.daysSinceLastUnpaidInstallments}</td>
                <td style={cell}>
                  {extraWarningDetails.daysSinceLastUnpaidInstallments}
                </td>
              </tr>
            )}
            {extraWarningDetails.lastUnpaidInstallmentDate && (
              <tr>
                <td style={header}>{local.lastUnpaidInstallmentDate}</td>
                <td style={cell}>
                  {timeToArabicDate(
                    extraWarningDetails.lastUnpaidInstallmentDate,
                    false
                  )}
                </td>
              </tr>
            )}
            {extraWarningDetails.unpaidInstallmentsCount && (
              <tr>
                <td style={header}>{local.unpaidInstallmentsCount}</td>
                <td style={cell}>
                  {extraWarningDetails.unpaidInstallmentsCount}
                </td>
              </tr>
            )}
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
