import ability from "../../config/ability"
import * as local from "../../../Shared/Assets/ar.json"
import { Tab } from "../HeaderWithCards/headerWithCards";
export const antiTerrorismArray = (): Tab[] => {
  const antiTerrorismArr: Tab[] = [];
  if (ability.can("getTerrorist", "customer")) {
    	antiTerrorismArr.push({
      header: local.terroristsList,
      icon: 'terrorists',
      desc: local.terroristsList,
			stringKey: "antiTerrorism",
      path: "/manage-anti-terrorism/anti-terrorism",
    },{
      header: local.terroristsListUn,
      icon: 'terrorists',
      desc: local.terroristsListUn,
			stringKey: "antiTerrorismUn",
      path: "/manage-anti-terrorism/anti-union-terrorism",
    }
    )
  }
  return antiTerrorismArr;
}
export const fullEnglishDate = (timeStamp: number) => {
  return new Date(timeStamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
    minute: 'numeric',
    second: 'numeric'
  }).replace(/,/g, '')
}