import * as Yup from "yup";
import * as local from "../../../Shared/Assets/ar.json";
import { getBirthdateFromNationalId } from "../../Services/nationalIdValidation";

export const paymentValidation = Yup.object().shape({
  payAmount: Yup.number()
    .moreThan(0, local.minPayment)
    .test(
      "Should not be before acceptance date",
      local.amountShouldNotExceedReqAmount,
      function (this: any, value: number) {
        return value <= this.parent.max;
      }
    )
    .required(local.required),
  truthDate: Yup.string().when(["paymentType", "penaltyAction"], {
    is: (paymentType, penaltyAction) =>
      paymentType === "normal" ||
      paymentType === "random" ||
      (paymentType === "penalties" && penaltyAction === "pay"),
    then: Yup.string().required(local.required),
    otherwise: Yup.string()
  }),
  randomPaymentType: Yup.string().when("paymentType", {
    is: paymentType => paymentType === "random",
    then: Yup.string()
      .trim()
      .required(local.required),
    otherwise: Yup.string()
  }),
  payerType: Yup.string().required(local.required),
  payerId: Yup.string().when(["payerType", "beneficiaryType"], {
    is: (payerType, beneficiaryType) => ((payerType === "beneficiary" && beneficiaryType === "group") || payerType === "employee"),
    then: Yup.string().required(local.required),
    otherwise: Yup.string()
  }),
  payerName: Yup.string().when("payerType", {
    is: payerType => (payerType === "family" || payerType === "nonFamily"),
    then: Yup.string().required(local.required),
    otherwise: Yup.string()
  }),
  payerNationalId: Yup.string()
});

export const earlyPaymentValidation = Yup.object().shape({
  payAmount: Yup.number()
    .moreThan(0, local.minPayment)
    .test("Should not be less than Required Amount", local.amountShouldNotbeLessThanReqAmount,
      function (this: any, value: number) {
        return value >= this.parent.remainingPrincipal
      }
    )
    .test("Should not exceed Required Amount", local.amountShouldNotExceedReqAmount,
      function (this: any, value: number) {
        return value <= this.parent.requiredAmount
      }
    )
    .required(local.required),
  truthDate: Yup.string().required(local.required),
  payerType: Yup.string().required(local.required),
  payerId: Yup.string().when(["payerType", "beneficiaryType"], {
    is: (payerType, beneficiaryType) => ((payerType === "beneficiary" && beneficiaryType === "group") || payerType === "employee"),
    then: Yup.string().required(local.required),
    otherwise: Yup.string()
  }),
  payerName: Yup.string().when("payerType", {
    is: payerType => (payerType === "family" || payerType === "nonFamily"),
    then: Yup.string().required(local.required),
    otherwise: Yup.string()
  }),
  payerNationalId: Yup.string()
})

export const manualPaymentValidation = Yup.object().shape({
  payAmount: Yup.number()
    .moreThan(0, local.minPayment)
    .test("Should not be before acceptance date", local.amountShouldNotExceedReqAmount,
      function (this: any, value: number) {
        return value <= this.parent.max
      }
    )
    .required(local.required),
  truthDate: Yup.string().required(local.required),
  receiptNumber: Yup.string().required(local.required),
  payerType: Yup.string().required(local.required),
  payerId: Yup.string().when(["payerType", "beneficiaryType"], {
    is: (payerType, beneficiaryType) => ((payerType === "beneficiary" && beneficiaryType === "group") || payerType === "employee"),
    then: Yup.string().required(local.required),
    otherwise: Yup.string()
  }),
  payerName: Yup.string().when("payerType", {
    is: payerType => (payerType === "family" || payerType === "nonFamily"),
    then: Yup.string().required(local.required),
    otherwise: Yup.string()
  }),
  payerNationalId: Yup.string()
})
