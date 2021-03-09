import iconv from 'iconv-lite'
import { getBusinessDevCode } from './getBusinessDevCode'

interface TextReport {
  name: string
  func: (data) => string
}
const getYearMonthDay = (dateTimeStamp: number) => {
  let date = new Date()
  if (dateTimeStamp) {
    date = new Date(dateTimeStamp)
  }
  const year = date.getFullYear()
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  return `${year}${month}${day}`
}
const getGender = (gender: string) => {
  if (gender === 'male') return 'M'
  return 'F'
}

const periodType = (type: string) => {
  if (type === 'days') return 'D'
  return 'M'
}

const getTotalNumberOfLines = (textData) => {
  let total = 0
  textData.forEach((application) => {
    total += application.installmentsObject.output.length
  })
  return total
}

export const numTo2Decimal = (num: number | string) => {
  const number = Number(num) || 0
  return (Math.round(number * 100) / 100).toFixed(2)
}

const getTotalPrincipals = (textData) => {
  let total = 0
  textData.forEach((application) => {
    if (application.principal) total += Number(application.principal)
  })
  return numTo2Decimal(total)
}

const getBeneficiaryType = (type: string) => {
  if (type === 'group') return 'T101'
  return 'T102'
}

const sameDay = (paidAt: number, dateOfPay: number) => {
  const paidAtD = new Date(paidAt)
  const dateOfPayD = new Date(dateOfPay)
  return (
    paidAtD.getFullYear() === dateOfPayD.getFullYear() &&
    paidAtD.getMonth() === dateOfPayD.getMonth() &&
    paidAtD.getDate() === dateOfPayD.getDate()
  )
}

const getTotalNumbersOfCustomers = (textData) => {
  let total = 0
  textData.forEach((loan) => {
    if (Object.keys(loan.customer).length > 0) total = +1
    else total += loan.group.individualsInGroup.length
  })
  return total
}
const getOrderedLine = (customer) => {
  if (/[\u0600-\u06FF]/.test(customer.customerHomeAddress)) {
    return `${customer.customerName}|${
      customer.customerHomeAddress ? customer.customerHomeAddress : ''
    }`
  }
  return `${customer.customerHomeAddress ? customer.customerHomeAddress : ''}|${
    customer.customerName
  }`
}
const cusTxt = (textData) => {
  return (
    `H|${getYearMonthDay(0)}|${getTotalNumbersOfCustomers(
      textData
    )}|TDIS_CUS|\n` +
    textData.map((application) => {
      const customer =
        application.product.beneficiaryType === 'group'
          ? application.group.individualsInGroup.find(
              (member) => member.type === 'leader'
            ).customer
          : application.customer
      if (application.product.beneficiaryType === 'group') {
        let groupTxt = ''
        application.group.individualsInGroup.map((individual) => {
          groupTxt += `D|N|${individual.customer.key}    |${getYearMonthDay(
            individual.customer.created.at
          )}|${individual.customer.customerName}||${getGender(
            individual.customer.gender
          )}|SINGLE|EG|National ID|${
            individual.customer.nationalId
          }|${getYearMonthDay(individual.customer.birthDate)}|2|${
            individual.customer.customerHomeAddress
          }|${getYearMonthDay(
            individual.customer.created.at
          )}|990|Cairo|EG|||4100|516|2|199|097|M5|1||${getOrderedLine(
            individual.customer
          )}|29|other|1|5|${getBusinessDevCode(
            individual.customer.businessSector
          )}|${getBusinessDevCode(
            individual.customer.businessActivity
          )}|${getBusinessDevCode(individual.customer.businessSpeciality)}|${
            customer.key
          }|\n`
        })
        return groupTxt
      }
      return `D|N|${customer.key}    |${getYearMonthDay(customer.created.at)}|${
        customer.customerName
      }||${getGender(customer.gender)}|SINGLE|EG|National ID|${
        customer.nationalId
      }|${getYearMonthDay(customer.birthDate)}|2|${
        customer.customerHomeAddress
      }|${getYearMonthDay(
        customer.created.at
      )}|990|Cairo|EG|||4100|516|2|199|097|M5|1||${getOrderedLine(
        customer
      )}|29|other|1|5|${getBusinessDevCode(
        customer.businessSector
      )}|${getBusinessDevCode(customer.businessActivity)}|${getBusinessDevCode(
        customer.businessSpeciality
      )}|${customer.key}|\n`
    }) +
    `T|${getYearMonthDay(0)}|${getTotalNumbersOfCustomers(
      textData
    )}|TDIS_CUS|\n`
  )
    .split(',')
    .join('')
    .replace(/\n/g, '\r\n')
}

const finText = (textData) => {
  return (
    `H|${getYearMonthDay(0)}|${getTotalPrincipals(textData)}|${
      textData.length
    }|TDIS_FIN|\n` +
    textData.map((application) => {
      const customer =
        application.product.beneficiaryType === 'group'
          ? application.group.individualsInGroup.find(
              (member) => member.type === 'leader'
            ).customer
          : application.customer
      return `D|${customer.key}          |N|${getYearMonthDay(
        application.issueDate
      )}|${
        application.principal
          ? numTo2Decimal(application.principal)
          : numTo2Decimal(0)
      }|${application.product.currency.toUpperCase()}|D|0||${
        application.product.interest
          ? application.product.interest + '.0000000'
          : '0.0000000'
      }|${getYearMonthDay(
        application.installmentsObject.output[
          application.installmentsObject.output.length - 1
        ].dateOfPayment
      )}|${application.installmentsObject.output.length}|${
        application.installmentsObject.output[0].principalInstallment
          ? numTo2Decimal(
              application.installmentsObject.output[0].principalInstallment
            )
          : numTo2Decimal(0)
      }|${
        application.installmentsObject.output[0].feesInstallment
          ? numTo2Decimal(
              application.installmentsObject.output[0].feesInstallment
            )
          : numTo2Decimal(0)
      }|${periodType(application.product.periodType)}|${getYearMonthDay(
        application.installmentsObject.output[0].dateOfPayment
      )}|${application.loanApplicationKey}      |${getBeneficiaryType(
        application.product.beneficiaryType
      )}|\n`
    }) +
    `T|${getYearMonthDay(0)}|${getTotalPrincipals(textData)}|${
      textData.length
    }|TDIS_FIN|\n`
  )
    .split(',')
    .join('')
    .replace(/\n/g, '\r\n')
}

const instText = (textData) => {
  return (
    `H|${getYearMonthDay(0)}|${getTotalNumberOfLines(textData)}|TDIS_INST|\n` +
    textData.map((application) => {
      return application.installmentsObject.output.map((installment) => {
        return `D|${application.loanApplicationKey}      |${
          installment.id ? installment.id : 0
        }|${application.installmentsObject.output.length}|${getYearMonthDay(
          installment.dateOfPayment
        )}|${
          installment.principalInstallment
            ? numTo2Decimal(installment.principalInstallment)
            : numTo2Decimal(0)
        }|${
          installment.feesInstallment
            ? numTo2Decimal(installment.feesInstallment)
            : numTo2Decimal(0)
        }|${
          installment.installmentResponse
            ? numTo2Decimal(installment.installmentResponse)
            : numTo2Decimal(0)
        }|\n`
      })
    }) +
    `T|${getYearMonthDay(0)}||${getTotalNumberOfLines(textData)}|TDIS_INST|\n`
  )
    .split(',')
    .join('')
    .replace(/\n/g, '\r\n')
}

const payText = (textData, dateOfPay: number) => {
  let totalPrincipal = 0
  let totalInterest = 0
  let totalNoOfInstallments = 0
  textData.forEach((application) => {
    application.installmentsObject.output?.forEach((installment) => {
      if (installment.status === 'paid') {
        totalNoOfInstallments += 1
        totalPrincipal += installment.principalInstallment
          ? Number(installment.principalInstallment)
          : 0
        totalInterest += installment.feesInstallment
          ? Number(installment.feesInstallment)
          : 0
      }
    })
  })
  return (
    `H|${getYearMonthDay(dateOfPay)}|${numTo2Decimal(
      totalPrincipal
    )}|${numTo2Decimal(totalInterest)}|${totalNoOfInstallments * 3}|TPAY|\n` +
    textData.map((application) => {
      const customer =
        application.product.beneficiaryType === 'group'
          ? application.group.individualsInGroup.find(
              (member) => member.type === 'leader'
            ).customer
          : application.customer
      let final = ''
      application.installmentsObject.output?.map((installment, index) => {
        if (
          installment.status === 'paid' &&
          sameDay(installment.paidAt, dateOfPay)
        ) {
          final += `D|${customer.key}      |I|${getYearMonthDay(dateOfPay)}|${
            installment.principalInstallment
              ? numTo2Decimal(installment.principalInstallment)
              : numTo2Decimal(0)
          }|EGP|C|0||||${
            installment.id ? installment.id : 0
          }||||${getYearMonthDay(
            application.installmentsObject.output[
              index + 1 > application.installmentsObject.output.length - 1
                ? index
                : index + 1
            ].dateOfPayment
          )}|${application.loanApplicationKey}    |${getBeneficiaryType(
            application.product.beneficiaryType
          )}|\n`
        }
      })
      application.installmentsObject.output?.map((installment, index) => {
        if (
          installment.status === 'paid' &&
          sameDay(installment.paidAt, dateOfPay)
        ) {
          final += `D|${customer.key}      |T|${getYearMonthDay(dateOfPay)}|${
            installment.feesInstallment
              ? numTo2Decimal(Number(installment.feesInstallment) * 0.4)
              : numTo2Decimal(0)
          }|EGP|C|0||||${
            installment.id ? installment.id : 0
          }||||${getYearMonthDay(
            application.installmentsObject.output[
              index + 1 > application.installmentsObject.output.length - 1
                ? index
                : index + 1
            ].dateOfPayment
          )}|${application.loanApplicationKey}    |${getBeneficiaryType(
            application.product.beneficiaryType
          )}|\n`
        }
      })
      application.installmentsObject.output?.map((installment, index) => {
        if (
          installment.status === 'paid' &&
          sameDay(installment.paidAt, dateOfPay)
        ) {
          final += `D|${customer.key}      |R|${getYearMonthDay(dateOfPay)}|${
            installment.feesInstallment
              ? numTo2Decimal(Number(installment.feesInstallment) * 0.6)
              : numTo2Decimal(0)
          }|EGP|C|0||||${
            installment.id ? installment.id : 0
          }||||${getYearMonthDay(
            application.installmentsObject.output[
              index + 1 > application.installmentsObject.output.length - 1
                ? index
                : index + 1
            ].dateOfPayment
          )}|${application.loanApplicationKey}    |${getBeneficiaryType(
            application.product.beneficiaryType
          )}|\n`
        }
      })
      return final
    }) +
    `T|${getYearMonthDay(dateOfPay)}|${numTo2Decimal(
      totalPrincipal
    )}|${numTo2Decimal(totalInterest)}|${totalNoOfInstallments * 3}|TPAY|`
  )
    .split(',')
    .join('')
    .replace(/\n/g, '\r\n')
}

// const trfText = (textData) => {
//   const branchData = {}
//   let total = 0
//   textData.forEach((application) => {
//     if (branchData[application.branchId]) {
//       branchData[application.branchId] =
//         branchData[application.branchId] +
//         (application.principal ? Number(application.principal) : 0)
//     } else
//       branchData[application.branchId] = application.principal
//         ? Number(application.principal)
//         : 0
//     total += application.principal ? Number(application.principal) : 0
//   })
//   return (
//     `H|${getYearMonthDay(0)}|${numTo2Decimal(total)}|${
//       Object.keys(branchData).length
//     }|TDIS_TRF|\n` +
//     Object.keys(branchData).map((branch) => {
//       return `D|100005743642      |100005143076     |EGP|${numTo2Decimal(
//         branchData[branch]
//       )}|${getYearMonthDay(0)}|0.00|\n`
//     }) +
//     `T|${getYearMonthDay(0)}|${numTo2Decimal(total)}|${
//       Object.keys(branchData).length
//     }|TDIS_TRF|\n`
//   )
// }

export const downloadTxtFile = (textData, tPay: boolean, dateOfPay: number) => {
  let filesArr: Array<TextReport> = []
  if (tPay) {
    filesArr = [{ name: 'TPAY', func: (data) => payText(data, dateOfPay) }]
  } else {
    filesArr = [
      { name: 'TDIS_CUS', func: (data) => cusTxt(data) },
      { name: 'TDIS_FIN', func: (data) => finText(data) },
      { name: 'TDIS_INST', func: (data) => instText(data) },
      // { name: 'TPAY', func: (textData) => payText(textData) },
      // { name: 'TDIS_TRF', func: (textData) => trfText(textData) }
    ]
  }
  filesArr.forEach((item) => {
    const element = document.createElement('a')
    let file
    if (item.name === 'TDIS_CUS') {
      file = new Blob([iconv.encode(item.func(textData), 'CP1256')], {
        type: 'text/plain',
      })
    } else {
      file = new Blob([item.func(textData)], { type: 'text/plain' })
    }
    element.href = URL.createObjectURL(file)
    const dateInName = getYearMonthDay(dateOfPay).toString()
    element.download = `${item.name}${dateInName.slice(2, dateInName.length)}`
    document.body.appendChild(element)
    element.click()
  })
}
