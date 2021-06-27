export const loading = (status) => {
  return (dispatch) => {
    dispatch({ type: 'SET_LOADING', payload: status })
  }
}
