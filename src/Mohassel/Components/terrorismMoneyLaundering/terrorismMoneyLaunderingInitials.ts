import ability from "../../config/ability"
import * as local from "../../../Shared/Assets/ar.json"
import { Tab } from "../HeaderWithCards/headerWithCards";
export const antiTerrorismMoneyLaunderingArray = (): Tab[] => {
  const antiTerrorismMoneyLaunderingArr: Tab[] = [];
  if (ability.can("getTerrorist", "customer")) {
    	antiTerrorismMoneyLaunderingArr.push({
      header: local.terroristsList,
      icon: 'terrorists',
      desc: local.terroristsList,
			stringKey: "antiTerrorism",
      path: "/anti-terrorism-money-laundering/anti-terrorism",
    },{
      header: local.terroristsListUn,
      icon: 'terrorists',
      desc: local.terroristsListUn,
			stringKey: "antiTerrorismUn",
      path: "/anti-terrorism-money-laundering/anti-union-terrorism",
    }
    )
  }
  return antiTerrorismMoneyLaunderingArr;
}
export const fullEnglishDate = (timeStamp: number) => {
  return new Date(timeStamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).replace(/,/g, '')
}