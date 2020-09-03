import { Document } from '../../Services/interfaces';

export const ADD_DOCUMENT = "ADD_DOCUMENT";
export const DELETE_DOCUMENT = "DELETE_DOCUMENT";
export const GET_DOCUMENTS = "GET_DOCUMENTS";
export const REMOVE_FROM_DOCUMENTS = "REMOVE_FROM_DOCUMENTS";
export const ADD_TO_DOCUMENTS = "ADD_TO_DOCUMENTS";
export const INVALID_DOCUMENT = "INVALID_DOCUMENT";
export interface DocumentState {
    document: Document;
}
export interface DocumentsState {
    imagesFiles: Document[];
    docName: string;
    docType: string;
    _id: string;
}

interface AddDocumentAction {
    type: typeof ADD_DOCUMENT;
    payload: string;
}
interface DeleteDocumentAction {
    type: typeof DELETE_DOCUMENT;
    payload: string;
}

interface GetDocumentsAction {
    type: typeof GET_DOCUMENTS;
    payload: DocumentsState;
}
interface RemoveFromDocumentsStateAction {
    type: typeof REMOVE_FROM_DOCUMENTS;
    key: string;
    name: string;
}
interface AddToDocumentsStateAction {
    type: typeof ADD_TO_DOCUMENTS;
    payload: Document;
    name: string;
}

interface InvalidDocumentStateAction {
    type: typeof INVALID_DOCUMENT;
    key: string;
    name: string;
}

export type DocumentActionType = AddDocumentAction | DeleteDocumentAction | GetDocumentsAction | RemoveFromDocumentsStateAction | AddToDocumentsStateAction | InvalidDocumentStateAction;