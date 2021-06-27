import axios from '../axios-instance'

interface BulkCreationObj {
  creationDate: number
  applicationIds: Array<string>
}

export const bulkCreation = async (data: BulkCreationObj) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/bulk-create`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
