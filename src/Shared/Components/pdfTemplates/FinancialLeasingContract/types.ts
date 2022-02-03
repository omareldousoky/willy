export interface FLContractProps {
  data: {
    creationDate: number
    customerType: string
    customerName: string
    guarantors: Guarantor[]
    vendorName: string
    principal: number
    categoryName: string
    itemDescription: string
    businessSector: string
    downPayment: number
    installmentResponse: number
    periodLength: number
    firstInstallmentDate: number
    lastInstallmentDate: number
    feesSum: number
    customerHomeAddress: string
    nationalId: string
    commercialRegisterNumber: string
    businessAddress: string
    taxCardNumber: string
    entitledToSign: EntitledToSign
  }
}
interface EntitledToSign {
  position: string
  name: string
}

export type SubjectStyle = 'index' | 'dotted' | 'dashed' | 'alphaIndex'

interface SubjectsData {
  id: number
  style?: SubjectStyle
  title?: string
}

export interface SubjectSubData {
  id?: string
  style?: SubjectStyle
  title?: string
  data: string[]
}

export interface SubjectMapper extends SubjectsData {
  data: (string | SubjectSubData)[]
}

interface Guarantor {
  name: string
  address: string
  nationalId: string
}
