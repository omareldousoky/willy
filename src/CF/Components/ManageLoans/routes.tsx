import React from 'react'
import local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import LoanProducts from './ProductsList'
import FormulaList from './CalculationFormulaList'
import LoanProductCreation from '../LoanProductCreation'
import ViewProduct from '../LoanProductCreation/LoanProductView'
import FormulaTest from '../LoanFormulaCreation/LoanFormulaTest'
import FormulaCreation from '../LoanFormulaCreation'
import ViewFormula from '../LoanFormulaCreation/CalculationFormulaView'

export const manageLoansRoutes = {
  path: '/manage-loans',
  label: local.loans,
  render: (props) => (
    <Can I="getLoanProduct" a="product">
      <LoanProducts {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/loan-products',
      label: local.loanProducts,
      render: (props) => (
        <Can I="getLoanProduct" a="product">
          <LoanProducts {...props} />
        </Can>
      ),
      routes: [
        {
          path: '/new-loan-product',
          label: local.createLoanProduct,
          render: (props) => (
            <Can I="createLoanProduct" a="product">
              <LoanProductCreation {...props} />
            </Can>
          ),
        },
        {
          path: '/edit-loan-product',
          label: local.editLoanProduct,
          render: (props) => (
            <Can I="updateLoanProduct" a="product">
              <LoanProductCreation {...props} edit />
            </Can>
          ),
        },
        {
          path: '/view-product',
          label: local.productName,
          render: (props) => (
            <Can I="getLoanProduct" a="product">
              <ViewProduct {...props} />
            </Can>
          ),
        },
      ],
    },
    {
      path: '/calculation-formulas',
      label: local.calculationFormulas,
      render: (props) => (
        <Can I="getCalculationFormula" a="product">
          <FormulaList {...props} />
        </Can>
      ),
      routes: [
        {
          path: '/new-formula',
          label: local.createCalculationMethod,
          render: (props) => (
            <Can I="createCalculationFormula" a="product">
              <FormulaCreation {...props} />
            </Can>
          ),
        },
        {
          path: '/view-formula',
          label: local.calculationFormulaId,
          render: (props) => (
            <Can I="getCalculationFormula" a="product">
              <ViewFormula {...props} />
            </Can>
          ),
        },
      ],
    },
    {
      path: '/test-formula',
      label: local.testCalculationMethod,
      render: (props) => (
        <Can I="testCalculate" a="product">
          <FormulaTest {...props} />
        </Can>
      ),
    },
  ],
}
