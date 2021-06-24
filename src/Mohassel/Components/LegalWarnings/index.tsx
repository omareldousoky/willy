import React from 'react'
import HeaderWithCards from '../HeaderWithCards/headerWithCards'
import { manageLegalAffairsArray } from '../ManageLegalAffairs/manageLegalAffairsInitials'
import local from '../../../Shared/Assets/ar.json'

export const LegalWarnings = () => {
  const manageLegalAffairsTabs = manageLegalAffairsArray()
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
