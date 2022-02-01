import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'
import {
  Values,
  RolesBranchesValues,
  MainChoosesValues,
} from './userCreationinterfaces'
import {
  endOfDayValue,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'

const date: number = new Date().valueOf()
const today = timeToDateyyymmdd(date)

export const initialStep1: Values = {
  name: '',
  username: '',
  nationalId: '',
  hrCode: '',
  birthDate: '',
  gender: '',
  nationalIdIssueDate: '',
  mobilePhoneNumber: '',
  hiringDate: today,
  password: '',
  confirmPassword: '',
}
export const initialStep2: RolesBranchesValues = {
  roles: [],
  branches: [],
}
export const initialStep3: MainChoosesValues = {
  mainBranchId: '',
  mainRoleId: '',
  manager: '',
}
export const wizardStepsArr = [
  {
    description: local.userBasicStep1,
    selected: true,
    completed: false,
  },
  {
    description: local.userRolesStep2,
    selected: false,
    completed: false,
  },
]

export const userCreationValidationStepOne = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(
      /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]/,
      local.containLetterError
    )
    .max(100, local.maxLength100)
    .required(local.required),
  username: Yup.string()
    .trim()
    .when('usernameChecker', {
      is: true,
      then: Yup.string().test(
        'error',
        local.duplicateUsernameMessage,
        () => false
      ),
      otherwise: Yup.string()
        .trim()
        .matches(
          /^(?!.*[\u0621-\u064A\u0660-\u0669 ])/,
          local.userNameErrorMessage
        )
        .max(100, local.maxLength100)
        .required(local.required),
    }),
  hrCode: Yup.string()
    .trim()
    .when('hrCodeChecker', {
      is: true,
      then: Yup.string()
        .trim()
        .test('error', local.duplicateHRCodeMessage, () => false),
      otherwise: Yup.string()
        .trim()
        .max(100, local.maxLength100)
        .required(local.required),
    }),
  mobilePhoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]*$/, local.onlyNumbers)
    .min(11, local.minLength11)
    .max(11, local.maxLength11),
  hiringDate: Yup.string().required(local.required),
  nationalId: Yup.number()
    .when('nationalIdChecker', {
      is: true,
      then: Yup.number().test(
        'error',
        local.duplicateNationalIdMessage,
        () => false
      ),
      otherwise: Yup.number()
        .typeError(local.nationalIdTypeError)
        .min(10000000000000, local.nationalIdLengthShouldBe14)
        .max(99999999999999, local.nationalIdLengthShouldBe14)
        .required(local.required),
    })
    .when('birthDate', {
      is: '1800-01-01',
      then: Yup.number().test('error', local.wrongNationalId, () => false),
      otherwise: Yup.number()
        .min(10000000000000, local.nationalIdLengthShouldBe14)
        .max(99999999999999, local.nationalIdLengthShouldBe14)
        .required(local.required),
    }),
  nationalIdIssueDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    })
    .required(local.required),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?!.*[\u0621-\u064A\u0660-\u0669 ])(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/,
      local.passwordValidationError
    )
    .required(local.required),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], local.confirmPasswordCheck)
    .required(local.required),
})
export const editUserValidationStepOne = Yup.object().shape({
  name: Yup.string()
    .trim()
    .max(100, local.maxLength100)
    .matches(
      /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]/,
      local.containLetterError
    )
    .required(local.required),
  hrCode: Yup.string()
    .trim()
    .when('hrCodeChecker', {
      is: true,
      then: Yup.string().test(
        'error',
        local.duplicateHRCodeMessage,
        () => false
      ),
      otherwise: Yup.string().trim().max(100, local.maxLength100),
      // .required(local.required),
    }),
  mobilePhoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]*$/, local.onlyNumbers)
    .min(11, local.minLength11)
    .max(11, local.maxLength11),
  hiringDate: Yup.string(),
  // .required(local.required),
  nationalId: Yup.number()
    .when('nationalIdChecker', {
      is: true,
      then: Yup.number().test(
        'error',
        local.duplicateNationalIdMessage,
        () => false
      ),
      otherwise: Yup.number()
        .typeError(local.nationalIdTypeError)
        .min(10000000000000, local.nationalIdLengthShouldBe14)
        .max(99999999999999, local.nationalIdLengthShouldBe14),
      // .required(local.required),
    })
    .when('birthDate', {
      is: '1800-01-01',
      then: Yup.number().test('error', local.wrongNationalId, () => false),
      otherwise: Yup.number()
        .min(10000000000000, local.nationalIdLengthShouldBe14)
        .max(99999999999999, local.nationalIdLengthShouldBe14),
      // .required(local.required),
    }),
  nationalIdIssueDate: Yup.string().test(
    'Max Date',
    local.dateShouldBeBeforeToday,
    (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    }
  ),
  // .required(local.required),
  password: Yup.string().matches(
    /^(?=.*[A-Z])(?!.*[\u0621-\u064A\u0660-\u0669 ])(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/,
    local.passwordValidationError
  ),
  confirmPassword: Yup.string().when('password', {
    is: (val) => val !== undefined,
    then: Yup.string()
      .oneOf([Yup.ref('password'), null], local.confirmPasswordCheck)
      .required(local.required),
    otherwise: Yup.string().notRequired(),
  }),
  username: Yup.string()
    .trim()
    .when('usernameChecker', {
      is: true,
      then: Yup.string().test(
        'error',
        local.duplicateUsernameMessage,
        () => false
      ),
      otherwise: Yup.string()
        .trim()
        .matches(
          /^(?!.*[\u0621-\u064A\u0660-\u0669 ])/,
          local.userNameErrorMessage
        )
        .max(100, local.maxLength100),
      // .required(local.required),
    }),
})
export const userValidationStepThree = Yup.object().shape({
  mainRole: Yup.object().required(local.required),
  mainBranch: Yup.object().required(local.required),
})
