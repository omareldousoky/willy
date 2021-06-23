export interface SearchFormValues {
  fromDate: number
  toDate: number
  branchId: string
  customerName?: string
}

export interface SearchFormProps {
  handleSearch: (values: SearchFormValues) => void
  setSearchFormValues: (newValues: Partial<SearchFormValues>) => void
  initialValues: Partial<SearchFormValues>
}
