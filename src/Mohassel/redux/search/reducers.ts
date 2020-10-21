
export const searchReducer = (state= {}, action) => {
    switch (action.type) {
        case 'SEARCH':
            return {...state, ...action.payload};
        case 'CLEAR_DATA': 
            return action.payload;
        default:
            return state;
    }
}

export const searchFiltersReducer = (state= {}, action) => {
    switch (action.type) {
        case 'SET_SEARCH_FILTERS': 
            return {...action.payload};
        case 'RESET_SEARCH_FILTERS': 
            return {};
        default:
            return state;
    }
}

export const issuedLoansSearchFiltersReducer = (state= {}, action) => {
    switch (action.type) {
        case 'SET_ISSUED_LOANS_SEARCH_FILTERS': 
            return {...state, ...action.payload};
        case 'RESET_ISSUED_LOANS_SEARCH_FILTERS': 
            return {};
        default:
            return state;
    }
}