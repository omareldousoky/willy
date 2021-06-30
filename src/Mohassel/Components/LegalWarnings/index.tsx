import React from 'react'
import FormCheck from 'react-bootstrap/FormCheck'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from '../ManageLegalAffairs/manageLegalAffairsInitials'
import local from '../../../Shared/Assets/ar.json'
import { TableMapperItem } from '../../../Shared/Components/DynamicTable/types'
import {
  LegalWarningResponse,
  LegalWarningType,
} from '../../Models/LegalAffairs'

export const LegalWarnings = () => {
  const manageLegalAffairsTabs = manageLegalAffairsArray()
  const tableMappers: TableMapperItem[] = [
    {
      title: () => (
        <FormCheck
          type="checkbox"
          // onChange={toggleSelectAllCustomers}
          // checked={
          //   !!customersForBulkAction.length &&
          //   customersForBulkAction.length === data.length
          // }
          // disabled={!searchFilters.reviewer}
        />
      ),
      key: 'selected',
      render: (warning: LegalWarningResponse) => (
        <FormCheck
          type="checkbox"
          // checked={
          //   !!customersForBulkAction.find(
          //     (selectedCustomer) => selectedCustomer._id === customer._id
          //   )
          // }
          // onChange={(e: ChangeEvent<HTMLInputElement>) =>
          //   toggleSelectCustomer(e, customer)
          // }
          // disabled={!searchFilters.reviewer}
        />
      ),
    },
    {
      title: local.customerCode,
      key: 'customerCode',
      render: (data) => data.key,
    },
  ]
  return (
    <HeaderWithCards
      header={local.legalAffairs}
      array={manageLegalAffairsTabs}
      active={manageLegalAffairsTabs
        .map((item) => {
          return item.icon
        })
        .indexOf('money-penalty')}
    />
  )
}
