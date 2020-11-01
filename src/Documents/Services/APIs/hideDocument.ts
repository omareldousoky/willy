import axios from '../../../Mohassel/Services/APIs/axios-instance';

interface Config {
  isHidden: boolean;
}

export const hideDocument = async (data: Config, id: string) => {
  const url = 
  // process.env.REACT_APP_BASE_URL 
  'https://lts-docs.dev.halan.io'+
  `/config/document-type/hidden/${id}`;
  try {
    const res = await axios.put(url, data);
    return { status: "success", body: res.data }
  }
  catch (error) {
    return { status: "error", error: error.response.data }
  }
}