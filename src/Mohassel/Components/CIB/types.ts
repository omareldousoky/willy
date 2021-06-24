export interface SearchFormValues {
  fromDate?: string
  toDate?: string
  branchId: string
  customerName: string
}

export interface SearchFormProps {
  handleSearch: (values: SearchFormValues) => void
  setSearchFormValues: (newValues: Partial<SearchFormValues>) => void
  initialValues: SearchFormValues
}
