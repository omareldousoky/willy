import * as Yup from "yup";
import * as local from "../../../Shared/Assets/ar.json";

const {
  maxLength100,
  required,
  onlyArabicLetters,
  minLength5,
  minLength10,
  minLength11,
  maxLength10,
  invalidEmail,
  invalidWebsite,
} = local;

export const companyCreationValidationStepOne = Yup.object().shape({
  customerName: Yup.string()
    .trim()
    .max(100, maxLength100)
    .required(required)
    .matches(/^(?!.*?\s{2})([\u0621-\u064A\s]+){1,100}$/, onlyArabicLetters),
  customerHomeAddress: Yup.string()
    .trim()
    .max(500, "Can't be more than 500 characters")
    .required(required),
  homePostalCode: Yup.string().min(5, minLength5),
  homePhoneNumber: Yup.string().min(10, minLength10),
  mobilePhoneNumber: Yup.string().min(11, minLength11),
  faxNumber: Yup.string().max(11, maxLength10).min(10, minLength10),
  emailAddress: Yup.string().matches(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    invalidEmail
  ),
  customerWebsite: Yup.string().url(invalidWebsite),
});
