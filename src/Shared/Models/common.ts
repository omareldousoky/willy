export interface Action {
  actionTitle: string
  actionPermission: boolean
  actionOnClick(currentId?: string): void
}

export interface ActionWithIcon extends Action {
  actionIcon: string
}
export interface Signature {
  by?: string
  at?: number
  userName?: string
}

export interface Trace {
  created: Signature
  updated: Signature
}

export interface Specialty {
  businessSpecialtyName: { ar: string }
  id: string
  active: boolean
}

export interface Activities {
  i18n: { ar: string }
  id: string
  specialties: Array<Specialty>
  active: boolean
}

export interface BusinessSector {
  i18n: { ar: string }
  id: string
  activities: Array<Activities>
}
