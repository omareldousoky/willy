import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer'
import { searchBranches } from '../../Services/APIs/Branch/searchBranches'
import { searchUsers } from '../../Services/APIs/Users/searchUsers'
import { searchLoan } from '../../../Mohassel/Services/APIs/Loan/searchLoan'
import { searchApplication } from '../../../Mohassel/Services/APIs/loanApplication/searchApplication'
import { searchActionLogs } from '../../../Mohassel/Services/APIs/ActionLogs/searchActionLogs'
import { searchLeads } from '../../../Mohassel/Services/APIs/Leads/searchLeads'
import { searchClearance } from '../../../Mohassel/Services/APIs/clearance/searchClearance'
import { searchGroups } from '../../../Mohassel/Services/APIs/ManagerHierarchy/searchGroups'
import {
  searchTerrorists,
  searchUnTerrorists,
} from '../../../Mohassel/Services/APIs/Terrorism/terrorism'
import { searchLoanOfficer } from '../../Services/APIs/LoanOfficers/searchLoanOfficer'
import {
  searchDefaultingCustomers,
  searchLegalAffairsCustomers,
} from '../../../Mohassel/Services/APIs/LegalAffairs/defaultingCustomers'
import { searchFinancialBlocking } from '../../../Mohassel/Services/APIs/loanApplication/financialClosing'
import { cibReport } from '../../../Mohassel/Services/APIs/loanApplication/cibReport'
import { searchWarnings } from '../../../Mohassel/Services/APIs/LegalAffairs/warning'

const searchWrapper = (
  request: any,
  searchApi: (request: any) => any,
  entity?: string
) => {
  return async (dispatch) => {
    delete request.url
    dispatch({ type: 'SET_LOADING', payload: true })
    const res = await searchApi(request)
    if (res.status === 'success') {
      let data = res.body
      if (!data && entity === 'cib') data = { loans: [], totalCount: 0 }
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({
        type: 'SEARCH',
        payload: { ...data, status: res.status, error: undefined },
      })
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({
        type: 'SEARCH',
        payload: { ...res.error, status: res.status },
      })
    }
  }
}
export const search = (request) => {
  const entityName: string = request.url
  switch (entityName) {
    case 'customer':
      return searchWrapper(request, searchCustomer)
    case 'branch':
      return searchWrapper(request, searchBranches)
    case 'user':
      return searchWrapper(request, searchUsers)
    case 'loan':
      return searchWrapper(request, searchLoan)
    case 'application':
      return searchWrapper(request, searchApplication)
    case 'actionLogs':
      return searchWrapper(request, searchActionLogs)
    case 'lead':
      return searchWrapper(request, searchLeads)
    case 'clearance':
      return searchWrapper(request, searchClearance)
    case 'supervisionsGroups':
      return searchWrapper(request, searchGroups)
    case 'loanOfficer':
      return searchWrapper(request, searchLoanOfficer)
    case 'defaultingCustomers':
      return searchWrapper(request, searchDefaultingCustomers)
    case 'legal-affairs':
      return searchWrapper(request, searchLegalAffairsCustomers)
    case 'terrorist':
      return searchWrapper(request, searchTerrorists)
    case 'terroristUn':
      return searchWrapper(request, searchUnTerrorists)
    case 'block':
      return searchWrapper(request, searchFinancialBlocking)
    case 'cib':
      return searchWrapper(request, cibReport, 'cib')
    case 'legal-warning':
      return searchWrapper(request, searchWarnings)
    case 'clearData':
      return (dispatch) => {
        dispatch({ type: 'CLEAR_DATA', payload: {} })
      }
    default:
      return null
  }
}

export const searchFilters = (obj) => {
  return (dispatch) => {
    if (Object.keys(obj).length === 0)
      dispatch({ type: 'RESET_SEARCH_FILTERS', payload: obj })
    else dispatch({ type: 'SET_SEARCH_FILTERS', payload: obj })
  }
}

export const issuedLoansSearchFilters = (obj) => {
  return (dispatch) => {
    if (Object.keys(obj).length === 0)
      dispatch({ type: 'RESET_ISSUED_LOANS_SEARCH_FILTERS', payload: obj })
    else dispatch({ type: 'SET_ISSUED_LOANS_SEARCH_FILTERS', payload: obj })
  }
}
