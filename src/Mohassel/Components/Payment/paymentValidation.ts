import * as Yup from "yup";
import * as local from "../../../Shared/Assets/ar.json";

export const paymentValidation = Yup.object().shape({
         payAmount: Yup.number()
           .moreThan(0, local.minPayment)
           .test(
             "Should not be before acceptance date",
             local.amountShouldNotExceedReqAmount,
             function(this: any, value: number) {
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
         })
       });

export const earlyPaymentValidation = Yup.object().shape({
  payAmount: Yup.number()
    .moreThan(0, local.minPayment)
    .test(
      "Should not be less than Required Amount",
      local.amountShouldNotbeLessThanReqAmount,
      function(this: any, value: number) {
        return value >= this.parent.remainingPrincipal;
      }
    )
    .test(
      "Should not exceed Required Amount",
      local.amountShouldNotExceedReqAmount,
      function(this: any, value: number) {
        return value <= this.parent.requiredAmount;
      }
    )
    .required(local.required),
  truthDate: Yup.string().required(local.required)
});
