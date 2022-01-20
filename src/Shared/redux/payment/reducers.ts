export const paymentReducer = (state = 0, action) => {
  switch (action.type) {
    case 'SET_PAYMENT_METHOD':
      return action.payload
    case 'DEFAULT_PAYMENT_METHOD':
      return 0
    default:
      return state
  }
}
