import { Document } from '../../Services/interfaces'

export const ADD_DOCUMENT = 'ADD_DOCUMENT'
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT'
export const GET_DOCUMENTS = 'GET_DOCUMENTS'
export const REMOVE_FROM_DOCUMENTS = 'REMOVE_FROM_DOCUMENTS'
export const ADD_TO_DOCUMENTS = 'ADD_TO_DOCUMENTS'
export const ADD_NEW_TO_DOCUMENTS = 'ADD_NEW_TO_DOCUMENT'
export const INVALID_DOCUMENT = 'INVALID_DOCUMENT'
export const ADD_TO_SELECTION_ARRAY = 'ADD_TO_SELECTION_ARRAY'
export const REMOVE_FROM_SELECTION_ARRAY = 'REMOVE_FROM_SELECTION_ARRAY'
export const CLEAR_SELECTION_ARRAY = 'CLEAR_SELECTION_ARRAY'
export const ADD_ALL_TO_SELECTION_ARRAY = 'ADD_ALL_TO_SELECTION_ARRAY'
export const CLEAR_DOCUMENTS = 'CLEAR_DOCUMENTS'
export interface DocumentState {
  document: Document
}
export interface DocumentsType {
  imagesFiles: Document[]
  docName: string
  type?: string
}
export type DocumentsState = Array<DocumentsType>
export interface Image {
  fileName: string
  url: string
}
interface AddDocumentAction {
  type: typeof ADD_DOCUMENT
  payload: string
}
interface DeleteDocumentAction {
  type: typeof DELETE_DOCUMENT
  payload: string
}

interface GetDocumentsAction {
  type: typeof GET_DOCUMENTS
  payload: DocumentsState
}
interface RemoveFromDocumentsStateAction {
  type: typeof REMOVE_FROM_DOCUMENTS
  key: string
  name: string
}
interface AddToDocumentsStateAction {
  type: typeof ADD_TO_DOCUMENTS
  payload: Document
  name: string
}

interface InvalidDocumentStateAction {
  type: typeof INVALID_DOCUMENT
  key: string
  name: string
}

interface AddNewToDocumentsStateAction {
  type: typeof ADD_NEW_TO_DOCUMENTS
  payload: any
}
interface AddToSelectionArrayAction {
  type: typeof ADD_TO_SELECTION_ARRAY
  payload: Image
}
interface RemoveFromSelectionArrayAction {
  type: typeof REMOVE_FROM_SELECTION_ARRAY
  payload: Image
}

interface ClearSelectionArrayAction {
  type: typeof CLEAR_SELECTION_ARRAY
}
interface CLEARDOCUMENTS {
  type: typeof CLEAR_DOCUMENTS
}
interface AddAllToSelectionArrayAction {
  type: typeof ADD_ALL_TO_SELECTION_ARRAY
  payload: Image[]
}
export type DocumentActionType =
  | AddDocumentAction
  | DeleteDocumentAction
  | GetDocumentsAction
  | RemoveFromDocumentsStateAction
  | AddToDocumentsStateAction
  | InvalidDocumentStateAction
  | AddNewToDocumentsStateAction
  | AddToSelectionArrayAction
  | RemoveFromSelectionArrayAction
  | ClearSelectionArrayAction
  | AddAllToSelectionArrayAction
  | CLEARDOCUMENTS
