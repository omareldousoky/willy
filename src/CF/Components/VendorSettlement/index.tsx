import React, { FunctionComponent, useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
// import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import Search from '../../../Shared/Components/Search/search'
// import { search as searchAction } from '../../../Shared/redux/search/actions'
import {
  beneficiaryType,
  getErrorMessage,
  // getFullCustomerKey,
  // removeEmptyArg,
  loanChipStatusClass,
  getFormattedLocalDate,
} from '../../../Shared/Services/utils'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { ActionsIconGroup } from '../../../Shared/Components'
// import { LoanListHistoryState, LoanListProps } from './types'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'
import { manageVendorSettlementsArray } from './manageVendorSettlements'
import { getHalanVendors } from '../../Services/APIs/Vendor/getHalanVendors'

const VendorSettlement: FunctionComponent<{}> = (props: {}) => {
  const [from, setFrom] = useState(0)
  const [size, setSize] = useState(10)

  // const history = useHistory<LoanListHistoryState>()

  // const dispatch = useDispatch()

  // const { search } = {
  //   search: (data) => dispatch(searchAction(data)),
  // }

  const { loans, error, totalCount, loading } = useSelector((state: any) => ({
    loans: state.search.applications,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
  }))

  async function getVendors() {
    const res = await getHalanVendors()
    if (res.status === 'success') {
      Swal.fire('success', local.userCreated)
    } else {
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }
  useEffect(() => {
    getVendors()
  }, [])
  useEffect(() => {
    if (error) Swal.fire('Error !', getErrorMessage(error), 'error')
  }, [error])

  // useEffect(() => {
  //   // avoid trigger when from == 0
  //   if (from) getLoans()
  // }, [from, size])

  const renderActions = (data) => {
    return [
      {
        actionTitle: local.view,
        actionIcon: 'view',
        actionPermission: true,
        actionOnClick: () => console.log(data.application._id, props),
      },
    ]
  }

  const tableMappers: TableMapperItem[] = [
    {
      title: local.customerType,
      key: 'customerType',
      render: (data) =>
        beneficiaryType(data.application.product.beneficiaryType),
    },
    {
      title: local.loanCode,
      key: 'loanCode',
      render: (data) => data.application.loanApplicationKey,
    },
    {
      title: local.customerName,
      key: 'name',
      sortable: true,
      render: (data) => (
        <div style={{ cursor: 'pointer' }}>
          {data.application.customer.customerName}
        </div>
      ),
    },
    {
      title: local.nationalId,
      key: 'nationalId',
      render: (data) => (
        <div style={{ cursor: 'pointer' }}>
          {data.application.customer.nationalId}
        </div>
      ),
    },
    {
      title: local.productName,
      key: 'productName',
      render: (data) => data.application.product.productName,
    },
    {
      title: local.loanIssuanceDate,
      key: 'issueDate',
      sortable: true,
      render: (data) =>
        data.application.issueDate
          ? getFormattedLocalDate(data.application.issueDate)
          : '',
    },
    {
      title: local.status,
      key: 'status',
      sortable: true,
      render: (data) => {
        const status = loanChipStatusClass[data.application.status || 'default']
        const isCancelled = status === 'canceled'
        return (
          <div className={`status-chip ${status}`}>
            {isCancelled ? local.cancelled : local[status]}
          </div>
        )
      },
    },
    {
      title: '',
      key: 'action',
      render: (data) => (
        <ActionsIconGroup currentId={data._id} actions={renderActions(data)} />
      ),
    },
  ]

  const searchKeys = ['vendor', 'dateFromTo']

  // const manageLoansTabs = manageLoansArray()

  return (
    <>
      <HeaderWithCards
        header={local.issuedLoans}
        array={manageVendorSettlementsArray()}
        active={manageVendorSettlementsArray()
          .map((item) => {
            return item.icon
          })
          .indexOf('issued-loans')}
      />
      <Card className="main-card">
        <Loader type="fullsection" open={loading} />
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.vendorSettlement}
              </Card.Title>
              {/* <span className="text-muted">
                {local.noOfIssuedLoans + ` (${totalCount ?? 0})`}
              </span> */}
            </div>
          </div>
          <hr className="dashed-line" />
          <Search
            cf
            searchKeys={searchKeys}
            searchPlaceholder={local.searchByBranchNameOrNationalIdOrCode}
            setFrom={(fromValue) => setFrom(fromValue)}
            datePlaceholder={local.issuanceDate}
            url="loan"
            from={from}
            size={size}
            hqBranchIdRequest=""
          />
          <DynamicTable
            pagination
            from={from}
            size={size}
            url="loan"
            totalCount={totalCount}
            mappers={tableMappers}
            data={loans}
            changeNumber={(key: string, number: number) => {
              if (key === 'from') {
                if (!number) console.log('HERE')
                else setFrom(number)
              } else setSize(number)
            }}
          />
        </Card.Body>
      </Card>
    </>
  )
}

export default VendorSettlement
