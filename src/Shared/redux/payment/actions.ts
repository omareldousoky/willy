export const payment = (state: number) => {
  return (dispatch) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: state })
  }
}
