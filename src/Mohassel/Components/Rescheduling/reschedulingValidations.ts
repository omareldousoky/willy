import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const reschedulingValidation = Yup.object().shape({
    noOfInstallments: Yup.number().integer('Must be int').min(1, 'Must be 1 or more').required(local.required),
    withInterest: Yup.boolean().required(local.required),
    postponementInterest: Yup.number().when("withInterest", {
        is: (val) => val === true,
        then: Yup.number().moreThan(0, "Can't be 0 or less").max(100, "Can't be more than 100").required(local.required),
        otherwise: Yup.number().notRequired()
    }),
    payWhere: Yup.string().when("withInterest", {
        is: (val) => val === true,
        then: Yup.string().required(local.required),
        otherwise: Yup.string().notRequired()
    }),
    installmentNumber: Yup.number().when("withInterest", {
        is: (val) => val === true,
        then: Yup.number().required(local.required),
        otherwise: Yup.number().notRequired()
    })
})
export const traditionalReschedulingValidation = Yup.object().shape({
    noOfInstallments: Yup.number().integer('Must be int').min(1, 'Must be 1 or more').required(local.required),
})
export const freeReschedulingValidation = Yup.object().shape({
    installments: Yup.array().of(
        Yup.object().shape({
            principalInstallment: Yup.number().min(Yup.ref('principalPaid')).required(local.required),
            feesInstallment: Yup.number().min(Yup.ref('feesPaid')).required(local.required),

        }).test('is before', '', function (item) {
            const { dateOfPayment } = item;
            const array = this.parent;
            const index = parseInt(this.path.split('[')[1].split(']')[0], 10);
            if (array[index - 1] && dateOfPayment < array[index - 1].dateOfPayment) {
                return this.createError({
                    path: `${this.path}.dateOfPayment`,
                    message: local.datesShouldBeInChronologicalOrder
                })
            } else {
                return true
            }
        }).test('is zero', '', function (item) {
            const { installmentResponse } = item;
            if (installmentResponse <= 0) {
                return this.createError({
                    path: `${this.path}.installmentResponse`,
                    message: local.mustBeGreaterThanZero
                })
            } else {
                return true
            }
        })
    )
})