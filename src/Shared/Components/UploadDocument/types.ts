import { Image } from 'Shared/redux/document/types'
import {
  getDocuments,
  addAllToSelectionArray,
  clearSelectionArray,
} from 'Shared/redux/document/actions'

export interface Props {
  application: any
  getDocuments: typeof getDocuments
  addAllToSelectionArray: typeof addAllToSelectionArray
  clearSelectionArray: typeof clearSelectionArray
  loading: boolean
  documents: any[]
  selectionArray: Image[]
}
export interface State {
  loading: boolean
  documentTypes: any[]
  selectAll: boolean
}
