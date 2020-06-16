
export const searchReducer = (state= {}, action) => {
    switch (action.type) {
        case 'SEARCH':
            return {...state, ...action.payload};
        default:
            return state;
    }
}

export const searchFiltersReducer = (state= {}, action) => {
    switch (action.type) {
        case 'SET_SEARCH_FILTERS': 
            return {...state, ...action.payload};
        case 'RESET_SEARCH_FILTERS': 
            return {};
        default:
            return state;
    }
}