export interface ConsumerFinanceContractData {
  customerCreationDate: number
  customerName: string
  nationalId: string
  customerHomeAddress: string
  mobilePhoneNumber: string
  initialConsumerFinanceLimit: number
  guarantors?: {
    name: string
    address: string
    nationalId: string
  }[]
}
