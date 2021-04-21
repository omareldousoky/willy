import React from 'react'
import {
  numbersToArabic,
  timeToArabicDate,
} from '../../../../Shared/Services/utils'
import {
  stringPlaceholder,
  moneyPlaceholder,
  numPlaceholder,
} from './reportLocal'

interface DataRowProps {
  type: 'string' | 'money' | 'number' | 'date';
  value?: string | number;
  placeholderType?: 'string' | 'money' | 'number';
  className?: string;
  meta?: Record<string, string>;
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
}: DataRowProps) => {
  const isDate = type === 'date'
  const isString = type === 'string'
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
            ? timeToArabicDate(Number(new Date (value).valueOf()) || 0, false)
            : stringPlaceholder}
        </td>
      )}
      {!isDate && !isString && (
        <td className={className || ''} {...meta}>
          {numbersToArabic(value) || placeHolders[placeholderType || type]}
        </td>
      )}
    </>
  )
}

export default DataRow
