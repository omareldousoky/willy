import { Image } from 'Shared/redux/document/types'
import {
  getDocuments,
  addAllToSelectionArray,
  clearSelectionArray,
} from 'Shared/redux/document/actions'

export interface UploadDocumentProps {
  application: any
  getDocuments: typeof getDocuments
  addAllToSelectionArray: typeof addAllToSelectionArray
  clearSelectionArray: typeof clearSelectionArray
  loading: boolean
  documents: any[]
  selectionArray: Image[]
}
export interface UploadDocumentState {
  loading: boolean
  documentTypes: any[]
  selectAll: boolean
}
