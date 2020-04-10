import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

const endOfDay: Date = new Date();
endOfDay.setHours(23, 59, 59, 59);

export const bulkApplicationApprovalValidation = Yup.object().shape({
    approvalDate: Yup.string().required(local.required),
    fundSource: Yup.string().required(local.required),
})