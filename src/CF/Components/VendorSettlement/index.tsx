import React, { FunctionComponent, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/esm/Button'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import local from '../../../Shared/Assets/ar.json'
import { getErrorMessage } from '../../../Shared/Services/utils'
import HeaderWithCards from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'
import { manageVendorSettlementsArray } from './manageVendorSettlements'
import VendorSettlementSearch from './vendorSettlementSearch'
import { getVendorOutstandingSettlements } from '../../../Shared/Services/APIs/VendorSettlements/searchSettlements'
import VendorSettlementModal from './VendorSettlementModal'

const VendorSettlement: FunctionComponent<{}> = () => {
  const [loading, setLoading] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [merchantId, setMerchantId] = useState('')
  const [transactions, setTransactions] = useState<any>([])
  const [
    vendorOutstandingSettlement,
    setVendorOutstandingSettlement,
  ] = useState(0)

  async function getOutstandingSettlements(vendorId, date) {
    setLoading(true)
    const toDate = new Date(date).setHours(23, 59, 59, 999).valueOf()
    const res = await getVendorOutstandingSettlements({
      merchantId: vendorId,
      toDate,
    })
    if (res.status === 'success') {
      setLoading(false)
      setTransactions(res.body.transactions ?? [])
      setVendorOutstandingSettlement(res.body.outstandingSettlement ?? 0)
      setMerchantId(vendorId)
    } else {
      setLoading(false)
      Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
    }
  }

  const tableMappers: TableMapperItem[] = [
    {
      title: local.customerType,
      key: 'customerType',
      render: (data) => data.transactionType,
    },
    {
      title: local.loanCode,
      key: 'loanCode',
      render: (data) => data.transactionNumber,
    },
    {
      title: local.customerName,
      key: 'name',
      render: (data) => (
        <div style={{ cursor: 'pointer' }}>{data.customerName}</div>
      ),
    },
    {
      title: local.vendor,
      key: 'nationalId',
      render: (data) => (
        <div style={{ cursor: 'pointer' }}>{data.merchantName}</div>
      ),
    },
    {
      title: local.productName,
      key: 'productName',
      render: (data) => data.price,
    },
  ]

  return (
    <>
      <HeaderWithCards
        // header={local.issuedLoans}
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
              {transactions.length > 0 && (
                <>
                  <span className="text-muted">
                    {local.noOfIssuedLoans + ` (${transactions.length ?? 0})`}
                  </span>
                  <span className="text-muted mx-2">
                    {local.loansSelectedAmount +
                      ` (${vendorOutstandingSettlement ?? 0})`}
                  </span>
                </>
              )}
            </div>
            {vendorOutstandingSettlement > 0 && (
              <div className="w-50 d-flex justify-content-end">
                <Button onClick={() => setViewModal(true)}>
                  {local.settle}
                </Button>
              </div>
            )}
          </div>
          <hr className="dashed-line" />
          <VendorSettlementSearch
            datePlaceholder={local.issuanceDate}
            submit={(data) =>
              getOutstandingSettlements(data.merchantId, data.toDate)
            }
          />
          <DynamicTable
            pagination={false}
            totalCount={0}
            mappers={tableMappers}
            data={transactions}
          />
        </Card.Body>
      </Card>
      {viewModal && (
        <VendorSettlementModal
          show={viewModal}
          hideModal={() => setViewModal(false)}
          onSuccess={() => window.location.reload()}
          vendorOutstandingSettlement={vendorOutstandingSettlement}
          merchantId={merchantId}
        />
      )}
    </>
  )
}

export default VendorSettlement
