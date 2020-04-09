import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

const endOfDay: Date = new Date();
endOfDay.setHours(23, 59, 59, 59);

export const searchApplicationValidation = Yup.object().shape({
    dateFrom: Yup.string().test(
        "Max Date", local.dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }
    ),
    // .required(local.required),
    dateTo: Yup.string().test(
        "Max Date", local.dateShouldBeBeforeToday,
        (value: any) => { return value ? (new Date(value).valueOf() <= endOfDay.valueOf()) : true }
    ),
    // .required(local.required),
    searchKeyword: Yup.string()
    // .required(local.required)
})