import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'

export const editLoanOfficerValidation = Yup.object().shape({
  password: Yup.string().matches(
    /^(?=.*[A-Z])(?!.*[\u0621-\u064A\u0660-\u0669 ])(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/,
    local.passwordValidationError
  ).required(local.required),
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
    }),
})
