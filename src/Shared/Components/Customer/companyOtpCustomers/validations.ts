import * as Yup from 'yup'
import local from '../../../Assets/ar.json'

export const otpCustomersFormValidation = Yup.object().shape({
  otpCustomers: Yup.array().of(
    Yup.object()
      .shape({
        nationalId: Yup.string()
          .min(14, local.nationalIdLengthShouldBe14)
          .required(local.required),
        phoneNumber: Yup.string()
          .min(11, local.minLength11)
          .required(local.required),
        name: Yup.string().required(local.required),
      })
      .test('is phone number duplicated', '', function (item) {
        const { phoneNumber } = item
        const array = this.parent
        const index = parseInt(this.path.split('[')[1].split(']')[0], 10)
        const duplicates = array.filter(
          (ele, eleIndex) =>
            eleIndex !== index && ele.phoneNumber === phoneNumber
        )
        if (duplicates.length > 0) {
          return this.createError({
            path: `${this.path}.phoneNumber`,
            message: local.duplicatePhoneNumberMessage,
          })
        }
        return true
      })
      .test('is national id duplicated', '', function (item) {
        const { nationalId } = item
        const array = this.parent
        const index = parseInt(this.path.split('[')[1].split(']')[0], 10)
        const duplicates = array.filter(
          (ele, eleIndex) => eleIndex !== index && ele.nationalId === nationalId
        )
        if (duplicates.length > 0) {
          return this.createError({
            path: `${this.path}.nationalId`,
            message: local.duplicateNationalIdMessage,
          })
        }
        return true
      })
  ),
})
