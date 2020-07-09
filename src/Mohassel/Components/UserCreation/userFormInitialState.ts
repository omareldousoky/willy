import * as Yup from "yup";
import * as local from "../../../Shared/Assets/ar.json";
import {
  Values,
  RolesBranchesValues,
  MainChoosesValues,
} from "./userCreationinterfaces";
import { timeToDateyyymmdd } from "../../Services/utils";

const date: number = new Date().valueOf();
const today = timeToDateyyymmdd(date);

export const initialStep1: Values = {
  name: "",
  username: "",
  nationalId: "",
  hrCode: "",
  birthDate: "",
  gender: "",
  nationalIdIssueDate: "",
  mobilePhoneNumber: "",
  hiringDate: today,
  password: "",
  confirmPassword: "",
};

export const userRolesOptions = [
  { label: "مراجع إداري", value: "1", hasBranch: "true" },
  { label: "مراجع مالي", value: "2" },
  { label: "مدخل بيانات", value: "3" },
];
export const userBranchesOptions = [
  { label: "سوهاج", value: "1" },
  { label: "الجيزة", value: "2" },
  { label: "القاهرة", value: "3" },
  { label: "1سوهاج", value: "4" },
  { label: "1الجيزة", value: "5" },
  { label: "1القاهرة", value: "6" },
  { label: "2سوهاج", value: "7" },
  { label: "2الجيزة", value: "8" },
  { label: "2القاهرة", value: "9" },
];
export const initialStep2: RolesBranchesValues = {
  roles: [],
  branches: [],
};
export const initialStep3: MainChoosesValues = {
  mainBranchId: "",
  mainRoleId: "",
  manager: "",
};
export const wizardStepsArr = [
  {
    description: local.userBasicStep1,
    selected: true,
    completed: false,
  },
  {
    description: local.userRolesStep2,
    selected: false,
    completed: false,
  },
];

const endOfDay: Date = new Date();
endOfDay.setHours(23, 59, 59, 59);
export const userCreationValidationStepOne = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(
      /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]/,
      local.containLetterError
    )
    .max(100, local.maxLength100)
    .required(local.required),
  username: Yup.string().when("usernameChecker", {
    is: true,
    then: Yup.string().test(
      "error",
      local.duplicateUsernameMessage,
      () => false
    ),
    otherwise: Yup.string()
      .trim()
      .matches(
        /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]/,
        local.containLetterError
      )
      .max(100, local.maxLength100)
      .required(local.required),
  }),
  hrCode: Yup.string()
    .trim()
    .max(100, local.maxLength100)
    .required(local.required),
  mobilePhoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]*$/, local.onlyNumbers)
    .min(11, local.minLength11)
    .max(11, local.maxLength11),
  hiringDate: Yup.string().required(local.required),
  nationalId: Yup.number()
    .when("nationalIdChecker", {
      is: true,
      then: Yup.number().test(
        "error",
        local.duplicateNationalIdMessage,
        () => false
      ),
      otherwise: Yup.number()
        .required()
        .min(10000000000000, local.nationalIdLengthShouldBe14)
        .max(99999999999999, local.nationalIdLengthShouldBe14)
        .required(local.required),
    })
    .when("birthDate", {
      is: "1800-01-01",
      then: Yup.number().test("error", local.wrongNationalId, () => false),
      otherwise: Yup.number()
        .required()
        .min(10000000000000, local.nationalIdLengthShouldBe14)
        .max(99999999999999, local.nationalIdLengthShouldBe14)
        .required(local.required),
    }),
  nationalIdIssueDate: Yup.string()
    .test("Max Date", local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true;
    })
    .required(local.required),
  password: Yup.string().required(local.required),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], local.confrimPasswordCheck)
    .required(local.required),
});
export const editUserValidationStepOne = Yup.object().shape({
  name: Yup.string()
    .trim()
    .max(100, local.maxLength100)
    .matches(
      /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]/,
      local.containLetterError
    )
    .required(local.required),
  hrCode: Yup.string()
    .trim()
    .max(100, local.maxLength100)
    .required(local.required),
  mobilePhoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]*$/, local.onlyNumbers)
    .min(11, local.minLength11)
    .max(11, local.maxLength11),
  hiringDate: Yup.string().required(local.required),
  nationalId: Yup.number()
    .when("nationalIdChecker", {
      is: true,
      then: Yup.number().test(
        "error",
        local.duplicateNationalIdMessage,
        () => false
      ),
      otherwise: Yup.number()
        .required()
        .min(10000000000000, local.nationalIdLengthShouldBe14)
        .max(99999999999999, local.nationalIdLengthShouldBe14)
        .required(local.required),
    })
    .when("birthDate", {
      is: "1800-01-01",
      then: Yup.number().test("error", local.wrongNationalId, () => false),
      otherwise: Yup.number()
        .required()
        .min(10000000000000, local.nationalIdLengthShouldBe14)
        .max(99999999999999, local.nationalIdLengthShouldBe14)
        .required(local.required),
    }),
  nationalIdIssueDate: Yup.string()
    .test("Max Date", local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true;
    })
    .required(local.required),
});
export const userValidationStepThree = Yup.object().shape({
  mainRole: Yup.object().required(local.required),
  mainBranch: Yup.object().required(local.required),
});
