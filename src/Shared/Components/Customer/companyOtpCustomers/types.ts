import { OtpCustomer } from 'Shared/Models/Customer'

export interface OtpCustomersFormModalProps {
  openModal: boolean
  otpCustomers: OtpCustomer[]
  setOpenModal: (data) => void
  save: (data) => void
}
