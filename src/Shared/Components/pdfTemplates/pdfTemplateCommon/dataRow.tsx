import React from 'react'
import {
  formatMoney,
  extractGMTDate,
  numbersToArabic,
  timeToArabicDate,
} from '../../../Services/utils'
import {
  stringPlaceholder,
  moneyPlaceholder,
  numPlaceholder,
} from './reportLocal'

interface DataRowProps {
  type: 'string' | 'money' | 'number' | 'date'
  value?: string | number
  placeholderType?: 'string' | 'money' | 'number'
  className?: string
  isFullDate?: boolean
  getGMTDate?: boolean
  meta?: Record<string, string>
}

const placeHolders = {
  string: stringPlaceholder,
  date: stringPlaceholder,
  money: moneyPlaceholder,
  number: numPlaceholder,
}

const DataRow = ({
  value,
  type,
  placeholderType,
  className,
  meta,
  isFullDate = false,
  getGMTDate = true,
}: DataRowProps) => {
  const isDate = type === 'date'
  const isString = type === 'string'
  const isMoney = type === 'money'
  return (
    <>
      {isString && (
        <td className={className || ''} {...meta}>
          {value || stringPlaceholder}
        </td>
      )}
      {isDate && (
        <td className={className || ''} {...meta}>
          {value
            ? getGMTDate && typeof value === 'number'
              ? extractGMTDate(value)
              : timeToArabicDate(
                  Number(new Date(value).valueOf()) || 0,
                  isFullDate as boolean
                )
            : stringPlaceholder}
        </td>
      )}
      {!isDate && !isString && (
        <td className={className || ''} {...meta}>
          {numbersToArabic(isMoney && value ? formatMoney(value) : value) ||
            placeHolders[placeholderType || type]}
        </td>
      )}
    </>
  )
}

export default DataRow
