
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
    ADD_NEW_TO_DOCUMENTS,
    Image,
    ADD_TO_SELECTION_ARRAY,
    ADD_ALL_TO_SELECTION_ARRAY,
    REMOVE_FROM_SELECTION_ARRAY,
    CLEAR_SELECTION_ARRAY,
} from './types';
import produce from 'immer';
const initialDocState: DocumentState = {
    document: {
        key: '',
        url: '',
        valid: true,
    }
}

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

export const DocumentsReducer = produce((draft: any[] = [], action: DocumentActionType) => {

    switch (action.type) {
        case GET_DOCUMENTS: {

            return draft = action.payload

        }
        case ADD_TO_DOCUMENTS: {

            for (const doc of draft) {
                if (doc.docName === action.name) {
                    doc.imagesFiles.push(action.payload)
                    break;
                }
            }
            break;
        }
        case ADD_NEW_TO_DOCUMENTS: {
            draft.push(action.payload)
            break;
        }
        case REMOVE_FROM_DOCUMENTS: {

            let index = -1;
            for (const doc of draft) {
                if (doc.docName === action.name) {
                    index = doc.imagesFiles.findIndex(item => item.key == action.key)
                }
                if (index !== -1) {
                    doc.imagesFiles.splice(index, 1);
                }
            }
            break;
        }
        case INVALID_DOCUMENT: {

            for (const doc of draft) {
                if (doc.docName === action.name) {
                    const index = doc.imagesFiles.findIndex(image => image.key === action.key);
                    if (index > -1) {
                        doc.imagesFiles[index].valid = false;
                    }
                }
            }
            break;
        }
        default:
            return draft;
    }
})
export const selectionArrayReducer = produce((draft: Image[] = [], action) => {
    switch (action.type) {
        case ADD_ALL_TO_SELECTION_ARRAY:
            return draft = action.payload
        case ADD_TO_SELECTION_ARRAY:
            draft.push(action.payload)
            break;
        case REMOVE_FROM_SELECTION_ARRAY:
            {
                let index = -1;
                index = draft.findIndex(element => element.fileName === action.payload)
               console.log(index , "index")
                if (index !== -1) {
                    draft.splice(index, 1);
                }
            }
            break;
        case CLEAR_SELECTION_ARRAY:
           return [];
        default:
            return draft;
    }
})