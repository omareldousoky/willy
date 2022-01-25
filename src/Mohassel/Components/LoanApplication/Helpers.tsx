import React from 'react'
import Button from 'react-bootstrap/Button'
import { getCustomersBalances } from 'Shared/Services/APIs/customer/customerLoans'
import { getAge, getErrorMessage } from 'Shared/Services/utils'
import Swal from 'sweetalert2'
import local from 'Shared/Assets/ar.json'
import { Product } from 'Shared/Services/interfaces'
import { LtsIcon } from 'Shared/Components'
import Can from 'Shared/config/Can'

const date = new Date()

export const setInitState = () => {
  return {
    step: 1,
    application: {
      beneficiaryType: '',
      individualDetails: [],
      customerID: '',
      customerName: '',
      customerCode: '',
      nationalId: '',
      birthDate: '',
      gender: '',
      nationalIdIssueDate: '',
      businessSector: '',
      businessActivity: '',
      businessSpeciality: '',
      permanentEmployeeCount: '',
      partTimeEmployeeCount: '',
      productID: '',
      calculationFormulaId: '',
      currency: 'egp',
      interest: 0,
      interestPeriod: 'yearly',
      minPrincipal: 0,
      maxPrincipal: 0,
      minInstallment: 0,
      maxInstallment: 0,
      allowInterestAdjustment: true,
      inAdvanceFees: 0,
      inAdvanceFrom: 'principal',
      inAdvanceType: 'uncut',
      periodLength: 1,
      periodType: 'days',
      gracePeriod: 0,
      pushPayment: 0,
      noOfInstallments: 1,
      principal: 0,
      applicationFee: 0,
      individualApplicationFee: 0,
      applicationFeePercent: 0,
      applicationFeeType: 'principal',
      applicationFeePercentPerPerson: 0,
      applicationFeePercentPerPersonType: 'principal',
      representativeFees: 0,
      allowRepresentativeFeesAdjustment: true,
      stamps: 0,
      allowStampsAdjustment: true,
      allowApplicationFeeAdjustment: true,
      adminFees: 0,
      allowAdminFeesAdjustment: true,
      entryDate: new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0],
      usage: '',
      representative: '',
      representativeName: '',
      enquirorId: '',
      visitationDate: new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')[0],
      guarantorIds: [],
      viceCustomers: [
        {
          name: '',
          phoneNumber: '',
        },
      ],
      state: 'under_review',
      reviewedDate: date,
      undoReviewDate: date,
      rejectionDate: date,
      noOfGuarantors: 0,
      guarantors: [],
      principals: {
        maxIndividualPrincipal: 0,
        maxGroupIndividualPrincipal: 0,
        maxGroupPrincipal: 0,
        maxGroupReturningIndividualPrincipal: 0,
      },
      customerTotalPrincipals: 0,
      customerMaxPrincipal: 0,
      branchManagerAndDate: false,
      branchManagerId: '',
      managerVisitDate: '',
      entitledToSignIds: [],
      entitledToSign: [],
      customerType: '',
      productType: '',
      nanoLoansLimit: 0,
      vendorName: '',
      itemDescription: '',
      categoryName: '',
    },
    customerType: '',
    loading: false,
    selectedCustomer: {},
    selectedGroupLeader: '',
    selectedLoanOfficer: {
      _id: '',
      username: '',
      name: '',
    },
    searchResults: {
      results: [],
      empty: false,
    },
    formulas: [],
    loanUsage: [],
    loanOfficers: [],
    products: [],
    branchCustomers: [],
    selectedCustomers: [],
    searchGroupCustomerKey: '',
    prevId: '',
    showModal: false,
    customerToView: {},
    isNano: false,
  }
}

export const getCustomerLimits = async (customers, principals) => {
  const customerIds: Array<string> = []
  customers.forEach((customer) => customerIds.push(customer._id))
  const res = await getCustomersBalances({ ids: customerIds })
  if (res.status === 'success') {
    const merged: Array<any> = []
    for (let i = 0; i < customers.length; i += 1) {
      const obj = {
        ...customers[i],
        ...(res.body.data
          ? res.body.data.find((itmInner) => itmInner.id === customers[i]._id)
          : { id: customers[i]._id }),
        ...principals,
      }
      delete obj.id
      merged.push(obj)
    }
    return merged
  }
  Swal.fire('error', getErrorMessage(res.error.error), 'error')
  return []
}

export const getGroupErrorMessage = (customer) => {
  let customerIsBlockerError = ''
  let groupAgeError = ''
  if (customer.blocked?.isBlocked === true) {
    customerIsBlockerError = `${local.theCustomerIsBlocked}`
  }
  const age = getAge(customer.birthDate)
  if (age > 67 || age < 18) {
    groupAgeError = `${local.groupAgeError}`
  }
  return (
    <span>
      {customerIsBlockerError} {customerIsBlockerError ? <br /> : null}
      {groupAgeError}
    </span>
  )
}

export const filterProducts = (
  product: Product,
  customerType: string,
  isNano: boolean
) => {
  if (!isNano) {
    switch (customerType) {
      case 'individual':
        return (
          product.beneficiaryType === 'individual' &&
          !product.financialLeasing &&
          product.type === 'micro'
        )
      case 'group':
        return product.beneficiaryType === 'group'
      // case 'nano':
      //   return product.type === 'nano'
      case 'financialLeasing':
        return (
          product.beneficiaryType === 'individual' &&
          product.financialLeasing &&
          product.type === 'micro'
        )
      case 'sme':
        return (
          product.beneficiaryType === 'individual' &&
          !product.financialLeasing &&
          product.type === 'sme'
        )
      case 'smeFinancialLeasing':
        return (
          product.beneficiaryType === 'individual' &&
          product.financialLeasing &&
          product.type === 'sme'
        )
      default:
        return true
    }
  }
  return product.type === 'nano'
}

export const chooseCustomerType = (
  setCustomerType: (data) => void,
  isSME?: boolean
) => (
  <div className="d-flex justify-content-center">
    {!isSME ? (
      <>
        <div className="d-flex flex-column m-5">
          <LtsIcon name="user" size="100px" color="#7dc356" />

          <Button
            className="my-4"
            onClick={() => setCustomerType('individual')}
          >
            {local.individual}
          </Button>
        </div>
        <div className="d-flex flex-column m-5">
          <LtsIcon name="group" size="100px" color="#7dc356" />

          <Button className="my-4" onClick={() => setCustomerType('group')}>
            {local.group}
          </Button>
        </div>
        <div className="d-flex flex-column m-5" style={{ margin: '20px 60px' }}>
          <LtsIcon name="coins" size="100px" color="#7dc356" />

          <Button className="my-4" onClick={() => setCustomerType('nano')}>
            {local.nano}
          </Button>
        </div>
        <div className="d-flex flex-column m-5">
          <LtsIcon name="user" size="100px" color="#7dc356" />

          <Button
            className="my-4"
            onClick={() => setCustomerType('financialLeasing')}
          >
            {local.financialLeasing}
          </Button>
        </div>
      </>
    ) : (
      <>
        <Can I="getSMEApplication" a="application">
          <div className="d-flex flex-column m-5">
            <LtsIcon name="buildings" size="100px" color="#7dc356" />

            <Button className="my-4" onClick={() => setCustomerType('sme')}>
              {local.company}
            </Button>
          </div>
        </Can>
        <Can I="getSMEApplication" a="application">
          <div className="d-flex flex-column m-5">
            <LtsIcon name="buildings" size="100px" color="#7dc356" />

            <Button
              className="my-4"
              onClick={() => setCustomerType('smeFinancialLeasing')}
            >
              {local.financialLeasing}
            </Button>
          </div>
        </Can>
      </>
    )}
  </div>
)

export const checkGroupValidation = (customer) => {
  const age = getAge(customer.birthDate)
  if (age <= 67 && age >= 18 && customer.blocked?.isBlocked !== true) {
    return false
  }
  return true
}
