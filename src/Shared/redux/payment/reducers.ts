export const paymentReducer = (state = 0, action) => {
  switch (action.type) {
    case 'SET_PAYMENT_METHOD':
      return action.payload

    default:
      return state
  }
}
