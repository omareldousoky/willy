import ability from "../../config/ability"
import * as local from "../../../Shared/Assets/ar.json"
import { Tab } from "../HeaderWithCards/headerWithCards";
export const antiTerrorismMoneyLaunderingArray = (): Tab[] => {
  const antiTerrorismMoneyLaunderingArr: Tab[] = [];
  if (ability.can("getRoles", "user")) {
    	antiTerrorismMoneyLaunderingArr.push({
      header: local.antiTerrorism,
      desc: local.terroristsList,
			stringKey: "antiTerrorism",
      path: "/anti-terrorism-money-laundering/anti-terrorism",
    })
  }
  return antiTerrorismMoneyLaunderingArr;
}