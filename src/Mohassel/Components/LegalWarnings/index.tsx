import React from 'react'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from '../ManageLegalAffairs/manageLegalAffairsInitials'
import local from '../../../Shared/Assets/ar.json'
import { Mapper } from '../../../Shared/Components/DynamicTable/types'

export const LegalWarnings = () => {
  const manageLegalAffairsTabs = manageLegalAffairsArray()
  const tableMappers: Mapper[] = [
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
