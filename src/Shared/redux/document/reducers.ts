import produce from 'immer'
import {
  ADD_DOCUMENT,
  DELETE_DOCUMENT,
  ADD_TO_DOCUMENTS,
  REMOVE_FROM_DOCUMENTS,
  DocumentState,
  GET_DOCUMENTS,
  INVALID_DOCUMENT,
  DocumentActionType,
  ADD_NEW_TO_DOCUMENTS,
  Image,
  ADD_TO_SELECTION_ARRAY,
  ADD_ALL_TO_SELECTION_ARRAY,
  REMOVE_FROM_SELECTION_ARRAY,
  CLEAR_SELECTION_ARRAY,
} from './types'

const initialDocState: DocumentState = {
  document: {
    key: '',
    url: '',
    valid: true,
  },
}

export const DocumentReducer = (state = initialDocState, action) => {
  switch (action.type) {
    case ADD_DOCUMENT:
      return { ...state, ...action.payload }
    case DELETE_DOCUMENT:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const DocumentsReducer = produce(
  (draft: any[] = [], action: DocumentActionType) => {
    switch (action.type) {
      case GET_DOCUMENTS: {
        return action.payload
      }
      case ADD_TO_DOCUMENTS: {
        draft.forEach((doc) => {
          if (doc.docName === action.name) {
            doc.imagesFiles.push(action.payload)
          }
        })
        break
      }
      case ADD_NEW_TO_DOCUMENTS: {
        draft.push(action.payload)
        break
      }
      case REMOVE_FROM_DOCUMENTS: {
        draft.forEach((doc) => {
          if (doc.docName === action.name) {
            doc.imagesFiles = doc.imagesFiles.filter(
              (item) => item.key !== action.key
            )
          }
        })
        break
      }
      case INVALID_DOCUMENT: {
        draft.forEach((doc) => {
          if (doc.docName === action.name) {
            const index = doc.imagesFiles.findIndex(
              (image) => image.key === action.key
            )
            if (index > -1) {
              doc.imagesFiles[index].valid = false
            }
          }
        })
        break
      }
      default:
        return draft
    }
  }
)
export const selectionArrayReducer = produce((draft: Image[] = [], action) => {
  switch (action.type) {
    case ADD_ALL_TO_SELECTION_ARRAY:
      return action.payload
    case ADD_TO_SELECTION_ARRAY:
      draft.push(action.payload)
      break
    case REMOVE_FROM_SELECTION_ARRAY:
      return draft.filter((element) => element.fileName !== action.payload)
    case CLEAR_SELECTION_ARRAY:
      return []
    default:
      return draft
  }
})
