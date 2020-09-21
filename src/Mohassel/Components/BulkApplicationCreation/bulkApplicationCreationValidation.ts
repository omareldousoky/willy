import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const bulkApplicationCreationValidation = Yup.object().shape({
    creationDate: Yup.string()
    .test("Creation date should be in the same month", local.creationDateShouldBeInTheSameMonth,
        function (this: any, value: string) {
            const todaysDate = new Date().getMonth();
            const creationDate = new Date(value).getMonth();
            return (todaysDate === creationDate)
        }
    ).required(local.required)
})