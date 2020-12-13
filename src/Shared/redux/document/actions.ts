import {
    ADD_DOCUMENT,
    DELETE_DOCUMENT,
    GET_DOCUMENTS,
    ADD_TO_DOCUMENTS,
    REMOVE_FROM_DOCUMENTS,
    INVALID_DOCUMENT,
    DocumentsState,
    ADD_NEW_TO_DOCUMENTS,
    Image,
    ADD_ALL_TO_SELECTION_ARRAY,
    CLEAR_SELECTION_ARRAY,
    ADD_TO_SELECTION_ARRAY,
    REMOVE_FROM_SELECTION_ARRAY,
} from './types';
import { uploadDocument as customerUploadDocument } from '../../../Mohassel/Services/APIs/Customer-Creation/uploadDocument';
import { uploadDocument as applicationUploadDocument } from '../../../Mohassel/Services/APIs/loanApplication/uploadDocument'
import { deleteDocument as customerDeleteDocument } from '../../../Mohassel/Services/APIs/Customer-Creation/deleteDocument';
import { deleteDocument as applicationDeleteDocument } from '../../../Mohassel/Services/APIs/loanApplication/deleteDocument';
import { getCustomerDocuments } from '../../../Mohassel/Services/APIs/Customer-Creation/getDocuments';
import { getApplicationDocuments } from '../../../Mohassel/Services/APIs/loanApplication/getDocuments';
import { uploadDeathCertificate } from '../../../Mohassel/Services/APIs/DeathCerificate/uploadDeathCertificate';
import { getDeathCertificate } from '../../../Mohassel/Services/APIs/DeathCerificate/getDeathCertificate';
import { deleteDeathCertificate } from '../../../Mohassel/Services/APIs/DeathCerificate/deleteDeathCertificate';
import { Document } from '../../Services/interfaces'
import Swal from 'sweetalert2';

const handleDocuments = (docs: any[], id, type) => {
    const documents: DocumentsState = [];
    if(type === "deathCertificate") {
        if(docs)
        documents.push({
            docName: "deathCertificate",
            imagesFiles: docs,
        })
    }
    else {
    docs?.map((doc) => {
    
        documents.push({
            docName: doc.name,
            imagesFiles: doc.docs,
        })
    });
}
    return documents;
}

export const uploadDocument = (obj, docType) => {
    switch (docType) {
        case ('customer'):
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true });
                const res = await customerUploadDocument(obj);
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: ADD_DOCUMENT, payload: { body: res.body, status: res.status } })
                } else {
                    dispatch({ type: ADD_DOCUMENT, payload: { error: res.error, status: res.status } })
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
                    dispatch({ type: ADD_DOCUMENT, payload: { body: res.body, status: res.status } })
                } else {
                    dispatch({ type: ADD_DOCUMENT, payload: { error: res.error, status: res.status } })
                }
            }

        case ('deathCertificate'):
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true });
                const res = await uploadDeathCertificate(obj);;
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: ADD_DOCUMENT, payload: { body: res.body, status: res.status } })
                } else {
                    dispatch({ type: ADD_DOCUMENT, payload: { error: res.error, status: res.status } })
                }
            }
        default:
            return null;
    }
}

export const deleteDocument = (obj, docType) => {
    switch (docType) {
        case ('customer'):
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true });
                const res = await customerDeleteDocument(obj);;
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: DELETE_DOCUMENT, payload: { body: res.body, status: res.status } })
                } else {
                    dispatch({ type: DELETE_DOCUMENT, payload: { error: res.error, status: res.status } })
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
                    dispatch({ type: DELETE_DOCUMENT, payload: { body: res.body, status: res.status } })
                } else {
                    dispatch({ type: DELETE_DOCUMENT, payload: { error: res.error, status: res.status } })
                }
            }
        case ('deathCertificate'):
            return async (dispatch) => {
                delete obj.docType;
                dispatch({ type: 'SET_LOADING', payload: true });
                const res = await deleteDeathCertificate(obj);;
                dispatch({ type: 'SET_LOADING', payload: false })
                if (res.status === "success") {
                    dispatch({ type: DELETE_DOCUMENT, payload: { body: res.body, status: res.status } })
                } else {
                    dispatch({ type: DELETE_DOCUMENT, payload: { error: res.error, status: res.status } })
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
                    Swal.fire("error!", res.error);
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
                    Swal.fire("error!", res.error);
                }
            }
        case ('deathCertificate'):
            return async (dispatch) => {
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await getDeathCertificate(obj.customerId);
                dispatch({ type: 'SET_LOADING', payload: false });
                if (res.status === "success") {
                    dispatch({ type: GET_DOCUMENTS, payload: handleDocuments(res.body.docs, obj.applicationId, documentType) })
                } else {
                    Swal.fire("error!", res.error);
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
export const addNewToDocuments = (newDoc: any) => {
    return {
        type: ADD_NEW_TO_DOCUMENTS,
        payload: newDoc,
    }
}
export const deleteFromDocuments = (key: string, docName: string) => {
    return {
        type: REMOVE_FROM_DOCUMENTS,
        key: key,
        name: docName,
    }
}

export const invalidDocument = (key: string, docName: string) => {
    return {
        type: INVALID_DOCUMENT,
        key: key,
        name: docName,
    }
}
export const addAllToSelectionArray = (images: Image[]) => {
    return {
        type: ADD_ALL_TO_SELECTION_ARRAY,
        payload: images,
    }

}
export const clearSelectionArray = () => {
    return {
        type: CLEAR_SELECTION_ARRAY,
    }
}
export const AddToSelectionArray = (newImage: Image) => {
    return {
        type: ADD_TO_SELECTION_ARRAY,
        payload: newImage,
    }
}
export const RemoveFromSelectionArray = (key: string) => {
    return {
        type: REMOVE_FROM_SELECTION_ARRAY,
        payload: key,

    }
}