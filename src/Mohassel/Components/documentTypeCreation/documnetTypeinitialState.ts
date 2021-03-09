import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'
import { DocumentType } from '../../../Shared/Services/interfaces'

export const documentType: DocumentType = {
  id: '',
  pages: 0,
  type: '',
  paperType: '',
  name: '',
  active: true,
  updatable: true,
}

export const documentTypeCreationValidation = Yup.object().shape({
  name: Yup.string().trim().required(local.required),
  pages: Yup.number().required(local.required).min(1, local.minNumOfPages1),
  type: Yup.string().trim().required(local.required),
  updatable: Yup.boolean(),
})

export const documentTypeEditValidation = Yup.object().shape({
  currPage: Yup.number(),
  pages: Yup.number()
    .required(local.required)
    .min(Yup.ref('currPage'), local.editNumOfPagesError),
  type: Yup.string().trim().required(local.required),
  updatable: Yup.boolean(),
})
