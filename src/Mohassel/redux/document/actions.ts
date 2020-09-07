import {
    ADD_DOCUMENT,
    DELETE_DOCUMENT,
    GET_DOCUMENTS,
    ADD_TO_DOCUMENTS,
    REMOVE_FROM_DOCUMENTS,
    INVALID_DOCUMENT,
    DocumentsState,
} from './types';
import { uploadDocument as customerUploadDocument } from '../../Services/APIs/Customer-Creation/uploadDocument';
import { uploadDocument as applicationUploadDocument } from '../../Services/APIs/loanApplication/uploadDocument'
import { deleteDocument as customerDeleteDocument } from '../../Services/APIs/Customer-Creation/deleteDocument';
import { deleteDocument as applicationDeleteDocument } from '../../Services/APIs/loanApplication/deleteDocument';
import { getCustomerDocuments } from '../../Services/APIs/Customer-Creation/getDocuments';
import { getApplicationDocuments } from '../../Services/APIs/loanApplication/getDocuments';
import {Document} from '../../Services/interfaces'

const handleDocuments = (docs: any[], id, type) => {
    const documents: DocumentsState = []
    docs.map((doc) => {
        documents.push({
            docType: type,
            _id: id,
            docName: doc.name,
            imagesFiles: doc.docs,
        })
    });
    return documents;
}

export const uploadDocument = (obj,docType) => {
    // const documentType = obj.docType
    switch (docType) {
        case ('customer'):
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true });
                const res = await customerUploadDocument(obj);
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: ADD_DOCUMENT, payload:{body: res.body , status: res.status} })
                } else {
                    dispatch({ type: ADD_DOCUMENT, payload:{error: res.error , status: res.status} })
                }
            }
        case ('loanApplication'):
        case ('issuedLoan'):
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true });
                const res = await applicationUploadDocument(obj);;
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: ADD_DOCUMENT, payload:{body: res.body , status: res.status} })
                } else {
                    dispatch({ type: ADD_DOCUMENT, payload:{error: res.error , status: res.status} })
                }
            }


        default:
            return null;
    }
}

export const deleteDocument = (obj,docType) => {
    switch (docType) {
        case ('customer'):
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true });
                const res = await customerDeleteDocument(obj);;
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: DELETE_DOCUMENT, payload:{body:res.body ,status: res.status } })
                } else {
                    dispatch({ type: DELETE_DOCUMENT, payload:{error:res.error ,status: res.status } })
                }
            }
        case ('loanApplication'):
        case ('issuedLoan'):
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true });
                const res = await applicationDeleteDocument(obj);;
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: DELETE_DOCUMENT, payload:{body:res.body ,status: res.status } })
                } else {
                    dispatch({ type: DELETE_DOCUMENT, payload:{error:res.error ,status: res.status } })
                }
            }
        default:
            return null;
    }
}
export const getDocuments = (obj) => {
    const documentType = obj.docType
    switch (documentType) {
        case 'customer':
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await getCustomerDocuments(obj.customerId);
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: GET_DOCUMENTS, payload: handleDocuments(res.body.docs, obj.customerId, documentType) })
                } else {
                    console.log("Error!");
                }
            }
        case ('loanApplication'):
        case ('issuedLoan'):
            return async (dispatch) => {

                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await getApplicationDocuments(obj.applicationId);
                dispatch({ type: 'SET_LOADING', payload: false });
                if (res.status === "success") {
                    dispatch({ type: GET_DOCUMENTS, payload: handleDocuments(res.body.docs, obj.applicationId, documentType) })
                } else {
                    console.log("Error!");
                }
            }
        default:
            return null;
    }

}
export const addToDocuments = (newDocument: Document, docName: string) => {
    return {
        type: ADD_TO_DOCUMENTS,
        payload: newDocument,
        name: docName,
    }
}
export const deleteFromDocuments = (key: string, docName: string) => {
    return {
        type: REMOVE_FROM_DOCUMENTS,
        key: key,
        name: docName,
    }
}

export const invalidDocument  = (key: string, docName: string) => {
    return {
        type: INVALID_DOCUMENT,
        key: key,
        name: docName,
    }
}