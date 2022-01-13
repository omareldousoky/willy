import { Image } from 'Shared/redux/document/types'
import {
  getDocuments,
  addAllToSelectionArray,
  clearSelectionArray,
  clearDocuments,
} from 'Shared/redux/document/actions'

export interface UploadDocumentProps {
  application: any
  getDocuments: typeof getDocuments
  addAllToSelectionArray: typeof addAllToSelectionArray
  clearSelectionArray: typeof clearSelectionArray
  clearDocuments: typeof clearDocuments
  loading: boolean
  documents: any[]
  selectionArray: Image[]
}
export interface UploadDocumentState {
  loading: boolean
  documentTypes: any[]
  selectAll: boolean
}
