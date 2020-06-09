
export const searchReducer = (state= {}, action) => {
    switch (action.type) {
        case 'SEARCH':
            return {...state, ...action.payload};
        default:
            return state;
    }
}