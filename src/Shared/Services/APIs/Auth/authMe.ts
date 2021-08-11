import { API_BASE_URL, REACT_APP_DOMAIN } from '../../../envConfig'
import axios from '../../axiosInstance'
import { getCookie } from '../../getCookie'

export const authMe = async () => {
  const url = API_BASE_URL + '/auth/me'
  try {
    const res = await axios.get(url)
    if (!getCookie('ltsbranch')) {
      if (res.data.validBranches && res.data.validBranches.length > 0) {
        document.cookie =
          'ltsbranch=' +
          JSON.stringify(res.data.validBranches[0]) +
          (REACT_APP_DOMAIN ? `;domain=${REACT_APP_DOMAIN}` : '') +
          ';path=/;'
      } else {
        document.cookie = `ltsbranch=;domain=${REACT_APP_DOMAIN};path=/;`
      }
    } else {
      const currentBranch = JSON.parse(getCookie('ltsbranch'))._id
      if (res.data.validBranches && res.data.validBranches.length > 0) {
        const foundBranch = res.data.validBranches?.find(
          (el) => el._id === currentBranch
        )
        if (!foundBranch && currentBranch !== 'hq') {
          document.cookie =
            'ltsbranch=' +
            JSON.stringify(res.data.validBranches[0]) +
            (REACT_APP_DOMAIN ? `;domain=${REACT_APP_DOMAIN}` : '') +
            ';path=/;'
        }
      } else {
        document.cookie = `ltsbranch=;domain=${REACT_APP_DOMAIN};path=/;`
      }
    }
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
