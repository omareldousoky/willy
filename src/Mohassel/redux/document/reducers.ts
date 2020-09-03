import {
    ADD_DOCUMENT,
    DELETE_DOCUMENT,
    ADD_TO_DOCUMENTS,
    REMOVE_FROM_DOCUMENTS,
    DocumentsState,
    DocumentState,
    GET_DOCUMENTS,
    INVALID_DOCUMENT,
    DocumentActionType,
} from './types';

const initialDocState: DocumentState = {
    document: {
        key: '',
        url: '',
        valid: true,
        selected: false,
    }
}
const initialDocsState: DocumentsState[] = [];
export const DocumentReducer = (state = initialDocState, action) => {
    switch (action.type) {
        case ADD_DOCUMENT:
            return { ...state, ...action.payload };
        case DELETE_DOCUMENT:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export const DocumentsReducer = (state = initialDocsState, action: DocumentActionType) => {
    switch (action.type) {
        case GET_DOCUMENTS: {
            return { ...state, ...action.payload };
        }
        case ADD_TO_DOCUMENTS: {

            const newState = state;
            for (const doc of newState) {
                if (doc.docName === action.name) {
                    doc.imagesFiles.push(action.payload)
                    break;
                }
            }

            return newState
        }
        case REMOVE_FROM_DOCUMENTS: {
            const newState = state;
            for (const doc of newState) {
                if (doc.docName === action.name ) {
                    doc.imagesFiles.filter(item => item.key !== action.key)
                }
            }
            return newState;
        }
        case INVALID_DOCUMENT: {
            const newState = state;
            for(const doc of newState){
                if(doc.docName === action.name){
                   const index = doc.imagesFiles.findIndex(image=> image.key === action.key);
                   if(index > -1) {
                       doc.imagesFiles[index].valid = false;
                   }
                }
            }
            return newState;
        }
        default:
            return state;
    }
}