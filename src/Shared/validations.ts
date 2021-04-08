import * as Yup from 'yup'
import * as local from "./Assets/ar.json";

export const required = (value?: string) =>
	!value?.trim() ? local.required : undefined;

export	const defaultValidationSchema = Yup.string().trim().max(100, local.maxLength100)

