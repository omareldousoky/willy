export const payment = (state: number) => {
  return (dispatch) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: state })
  }
}
export const resetPayment = () => {
  return (dispatch) => {
    dispatch({ type: 'DEFAULT_PAYMENT_METHOD' })
  }
}
