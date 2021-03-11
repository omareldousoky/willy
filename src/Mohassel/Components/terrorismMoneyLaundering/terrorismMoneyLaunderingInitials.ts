import ability from "../../config/ability"
import * as local from "../../../Shared/Assets/ar.json"
import { Tab } from "../HeaderWithCards/headerWithCards";
export const antiTerrorismMoneyLaunderingArray = (): Tab[] => {
  const antiTerrorismMoneyLaunderingArr: Tab[] = [];
  if (ability.can("getSuspect", "customer")) {
    	antiTerrorismMoneyLaunderingArr.push({
      header: local.antiTerrorism,
      icon: 'users',
      desc: local.terroristsList,
			stringKey: "antiTerrorism",
      path: "/anti-terrorism-money-laundering/anti-terrorism",
    })
  }
  return antiTerrorismMoneyLaunderingArr;
}