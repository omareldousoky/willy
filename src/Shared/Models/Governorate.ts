interface Village {
  villageName: { ar: string }
  villageLegacyCode: number
}

export interface District {
  districtName: { ar: string }
  districtLegacyCode: number
  villages: Array<Village>
}

export interface Governorate {
  governorateName: { ar: string }
  governorateLegacyCode: number
  districts: Array<District>
}

export interface GovernoratesResponse {
  governorates: Governorate[]
}
