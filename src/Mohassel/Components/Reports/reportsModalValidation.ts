import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

const minYear =   new Date(2021,0,1);
export const reportsModalValidation = Yup.object().shape({
    fromDate: Yup.string(),
    toDate: Yup.string(),
    branches: Yup.array().nullable(),
    key: Yup.string(),
    quarterYear:  Yup.string().test(
        "Min Date", local.dateCantBeBefore2021,
        (value: string) => { return value ? new Date(value).valueOf() >= minYear.valueOf() : true }
    ),
})