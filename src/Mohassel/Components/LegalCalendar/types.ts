export interface CalendarEvent {
  sessionDate: number
  sessionType:
    | 'firstCourtSession'
    | 'oppositionSession'
    | 'misdemeanorAppealSession'
    | 'oppositionAppealSession'
  customerId: string
  customerKey: number
  customerType: 'individual' | 'group' | 'company'
  customerName: string
  caseNumber: string
  settlementType: string
  court: string
  caseStatus: string
  caseStatusSummary: string
  decision: string
}

export interface FormattedEvents {
  [key: string]: CalendarEvent[]
}
export interface CalendarProps {
  daysOfWeek: string[]
  weekDaysDates: Date[]
  eventsMaxLength: number
  events?: FormattedEvents
}
