import { AxiosResponse } from "axios"
import { SuspectResponse } from "../../../../Shared/Services/interfaces"
import { ApiResponse } from "../../interfaces"
import axios from "../axios-instance"

const { REACT_APP_BASE_URL } = process.env
const fetchSearchSuspectUrl = `${REACT_APP_BASE_URL}/search/suspect`
interface SearchSuspectsRequest {
  size: number;
 	from: number;
  order: string;
  fromDate: number;
  toDate: number;
  name: number;
}

export const searchSuspects =  async (
	request: SearchSuspectsRequest
): Promise<ApiResponse<SuspectResponse[]>> => {
	try {
	 const res: AxiosResponse<SuspectResponse[]> = await axios.post(
	 	fetchSearchSuspectUrl,
		request
	);
		return {status: "success", body: res.data};
	} catch(error) {
		return {status: "error", error: error.response.data};
	}
}

export const uploadSuspectDocument =  async (data: FormData) => {
    const url =  `${REACT_APP_BASE_URL}/customer/suspect-document`;
    try{
        const res = await axios.post(url,data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}