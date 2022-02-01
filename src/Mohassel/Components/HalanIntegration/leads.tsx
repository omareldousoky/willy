import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import HeaderWithCards, {
  Tab,
} from 'Shared/Components/HeaderWithCards/headerWithCards'
import { Loader } from 'Shared/Components/Loader'
import Search from 'Shared/Components/Search/search'
import DynamicTable from 'Shared/Components/DynamicTable/dynamicTable'

import {
  getBranchFromCookie,
  getDateAndTime,
  getErrorMessage,
} from 'Shared/Services/utils'
import { search } from 'Shared/redux/search/actions'
import Can from 'Shared/config/Can'
import local from 'Shared/Assets/ar.json'
import {
  changeInReviewLeadState,
  changeLeadState,
} from 'Shared/Services/APIs/Leads/changeLeadState'
import { LtsIcon } from 'Shared/Components'
import Modal from 'react-bootstrap/esm/Modal'
import Col from 'react-bootstrap/esm/Col'
import Form from 'react-bootstrap/esm/Form'
import { getLeadStatus, leadsTabs, statusClasses } from './utils'
import { LeadActionModal } from './leadActionModal'
import { LeadActions } from './leadActions'
import { RejectLeadModal } from './rejectLeadModal'

export const Leads = () => {
  const leads = useSelector((state: any) => state.search.data)
  const totalCount = useSelector((state: any) => state.search.totalCount) || ''
  const loading = useSelector((state: any) => state.loading)
  const error = useSelector((state: any) => state.search.error)
  const searchFilters = useSelector((state: any) => state.searchFilters)

  const [isLoading, setIsLoading] = useState<boolean>(loading)
  const [from, setFrom] = useState<number>(0)
  const [size, setSize] = useState<number>(10)

  const [selectedLead, setSelectedLead] = useState<any>(null)
  // TODO maybe inside lead object
  const [selectedLeadNumber, setSelectedLeadNumber] = useState<string>('')

  // active tabs and action modals
  const [activeTab, setActiveTab] = useState<leadType>('micro')
  const [rejectLeadModal, setRejectLeadModal] = useState<boolean>(false)
  const [viewRejectionModal, setViewRejectionModal] = useState<boolean>(false)
  const [activeModal, setActiveModal] = useState<'loanOfficer' | 'branch' | ''>(
    ''
  )

  const isHq = getBranchFromCookie() === 'hq'

  const branchId = isHq ? '' : getBranchFromCookie()

  const dispatch = useDispatch()
  const history = useHistory()

  const searchLeads = async () => {
    dispatch(
      search({
        ...searchFilters,
        size,
        from,
        url: 'lead',
        branchId,
        leadType: activeTab,
      })
    )
  }
  const changeMainState = async (
    phoneNumber: string,
    newState: string,
    rejectionReason?: string,
    rejectionDetails?: string
  ) => {
    setIsLoading(true)

    const res = await changeLeadState(
      phoneNumber,
      newState,
      rejectionReason,
      rejectionDetails
    )
    if (res.status === 'success') {
      setIsLoading(false)
      setRejectLeadModal(false)

      Swal.fire({
        text: local.changeState,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => searchLeads())
    } else {
      setIsLoading(false)
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: local.userRoleEditError,
        icon: 'error',
      })
    }
  }
  const updateLeadState = (
    phoneNumber: string,
    oldState: string,
    oldInReviewStatus: string,
    newState: string,
    inReviewStatus: string
  ) => {
    if (newState === 'rejected') {
      setRejectLeadModal(true)
      setSelectedLeadNumber(phoneNumber)
    } else {
      Swal.fire({
        text: local.areYouSure,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: local.yes,
        cancelButtonText: local.cancel,
      }).then(async (result) => {
        if (result.value) {
          if (oldState === newState) {
            if (oldInReviewStatus === 'basic') {
              setIsLoading(true)
              const inReviewStatusRes = await changeInReviewLeadState(
                phoneNumber,
                inReviewStatus
              )
              if (inReviewStatusRes.status === 'success') {
                setIsLoading(false)
                Swal.fire({
                  text: local.changeState,
                  icon: 'success',
                  confirmButtonText: local.confirmationText,
                }).then(() => searchLeads())
              } else {
                setIsLoading(false)
                Swal.fire({
                  confirmButtonText: local.confirmationText,
                  text: local.userRoleEditError,
                  icon: 'error',
                })
              }
            }
          } else {
            changeMainState(phoneNumber, newState)
          }
        }
      })
    }
  }

  const mappers: mapper[] = [
    {
      title: local.leadName,
      key: 'name',
      render: (data) => data.customerName,
    },
    {
      title: local.governorate,
      key: 'governorate',
      render: (data) => data.businessGovernate,
    },
    {
      title: local.branchName,
      key: 'branch',
      render: (data) => data.branchName,
    },
    {
      title: local.status,
      key: 'status',
      render: (data) => (
        <span className={`status-chip ${statusClasses[data.status]}`}>
          {getLeadStatus(data.status)}
        </span>
      ),
    },
    {
      title: local.creationDate,
      key: 'createdAt',
      render: (data) => (data.createdAt ? getDateAndTime(data.createdAt) : ''),
    },
    {
      title: () => local.loanOfficer,
      key: 'loanOfficer',
      render: (data) => data.loanOfficerName,
    },
    {
      title: () => (
        <Can I="assignLead" a="halanuser">
          {local.chooseLoanOfficer}
        </Can>
      ),
      key: 'changeLoanOfficer',
      render: (data) =>
        data.status !== 'rejected' && (
          <Can I="assignLead" a="halanuser">
            <Button
              variant="default"
              onClick={() => {
                setSelectedLead(data)
                setActiveModal('loanOfficer')
              }}
              title="change-loan-officer"
            >
              <LtsIcon name="exchange" />
            </Button>
          </Can>
        ),
    },
    {
      title: () => (
        <Can I="assignLead" a="halanuser">
          {local.chooseBranch}
        </Can>
      ),
      key: 'changeLeadBranch',
      render: (data) =>
        data.status !== 'rejected' && (
          <Can I="assignLead" a="halanuser">
            <Button
              variant="default"
              onClick={() => {
                setSelectedLead(data)
                setActiveModal('branch')
              }}
              title="change-branch"
            >
              <LtsIcon name="branches" />
            </Button>
          </Can>
        ),
    },
    {
      title: () => (
        <Can I="reviewLead" a="halanuser">
          {local.actions}
        </Can>
      ),
      key: 'actions',
      render: (data) => (
        <LeadActions
          data={data}
          changeLeadState={updateLeadState}
          setSelectedLead={setSelectedLead}
          setViewRejectionModal={setViewRejectionModal}
        />
      ),
    },
  ]

  useEffect(() => {
    searchLeads()
  }, [activeTab, size, from, selectedLead])

  useEffect(() => {
    error &&
      Swal.fire({
        title: local.error,
        text: getErrorMessage(error),
        icon: 'error',
        confirmButtonText: local.confirmationText,
      })
  }, [error])

  const currentTab = leadsTabs.filter(
    (tab) => tab.stringKey === activeTab
  )[0] as Tab
  return (
    <>
      <HeaderWithCards
        header={local.applicantsLeads}
        array={leadsTabs}
        active={leadsTabs.findIndex((tab) => tab.stringKey === activeTab)}
        selectTab={(selected) => setActiveTab(selected as leadType)}
      />
      <Card className="m-4">
        <Loader type="fullscreen" open={isLoading} />
        <Card.Body>
          <Card.Title>{currentTab.header}</Card.Title>
          <div className="d-flex justify-content-between">
            <span className="text-secondary align-center my-2">
              {local.noOfApplicants + ` (${totalCount})`}
            </span>
            {!isHq && (
              <Can I="getLead" a="halanuser">
                <Button
                  onClick={() =>
                    history.push('/halan-integration/leads/create-lead')
                  }
                >
                  {local.createLead}
                </Button>
              </Can>
            )}
          </div>
          <hr className="dashed-line" />
          <Search
            searchKeys={['keyword', 'dateFromTo', 'leads-status', 'lastDates']}
            dropDownKeys={['name']}
            searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
            hqBranchIdRequest={branchId}
            url="lead"
            from={from}
            size={size}
            leadType={activeTab}
          />
          {leads && (
            <DynamicTable
              from={from}
              size={size}
              totalCount={totalCount}
              mappers={mappers}
              pagination
              data={leads}
              url="lead"
              changeNumber={(key: string, number: number) => {
                if (key === 'from') setFrom(number)
                else setSize(number)
              }}
            />
          )}
        </Card.Body>
      </Card>

      {activeModal && (
        <LeadActionModal
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          selectedLead={selectedLead}
          setSelectedLead={setSelectedLead}
          setIsLoading={setIsLoading}
        />
      )}
      <RejectLeadModal
        rejectLeadModal={rejectLeadModal}
        setRejectLeadModal={setRejectLeadModal}
        changeMainState={changeMainState}
        selectedLeadNumber={selectedLeadNumber}
        setSelectedLeadNumber={setSelectedLeadNumber}
      />
      <Modal
        size="lg"
        show={viewRejectionModal}
        onHide={() => setViewRejectionModal(false)}
      >
        <Modal.Header>
          <Modal.Title className="m-auto">{local.rejectionReason}</Modal.Title>
          <button
            type="button"
            className="mr-0 pr-0 close"
            onClick={() => {
              setViewRejectionModal(false)
              setSelectedLead({})
            }}
          >
            <span aria-hidden="true">x</span>
            <span className="sr-only">Close</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Col>
            <Form.Group controlId="rejectionReason">
              <Form.Label className="font-weight-bold">
                {selectedLead?.rejectionReason}
              </Form.Label>
            </Form.Group>
            <Form.Group controlId="rejectionDetails">
              <Form.Label>{selectedLead?.rejectionDetails}</Form.Label>
            </Form.Group>
          </Col>
          <Col>
            <Button
              type="submit"
              className="mt-4 w-100"
              variant="primary"
              onClick={() => {
                setViewRejectionModal(false)
                setSelectedLead({})
              }}
            >
              {local.done}
            </Button>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}
