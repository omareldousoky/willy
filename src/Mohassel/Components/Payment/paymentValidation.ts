import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const paymentValidation = Yup.object().shape({
    payAmount: Yup.number()
        .moreThan(0, local.minPayment)
        .test("Should not be before acceptance date", local.amountShouldNotExceedReqAmount,
            function (this: any, value: number) {
                return value <= this.parent.max
            }
        )
        .required(local.required),
    truthDate: Yup.string().required(local.required)
})