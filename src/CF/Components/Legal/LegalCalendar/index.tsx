import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './style.scss'

import startOfWeek from 'date-fns/startOfWeek'
import getWeekOfMonth from 'date-fns/getWeekOfMonth'
import sub from 'date-fns/sub'
import add from 'date-fns/add'
import isEqual from 'date-fns/isEqual'
import startOfDay from 'date-fns/startOfDay'

import Card from 'react-bootstrap/Card'

import HeaderWithCards from '../../../../Shared/Components/HeaderWithCards/headerWithCards'
import { Calendar } from './Calendar'
import { Navigation } from './Navigation'

import local from '../../../../Shared/Assets/ar.json'
import {
  DAYS_OF_WEEK,
  formatWrapper,
  initFormattedEvents,
  MIN_ROWS,
  WEEKS,
} from './utils'

import { CalendarEvent, FormattedEvents } from './types'
import { getCalendarEvents } from '../../../../Shared/Services/APIs/LegalAffairs/calendar'
import { manageLegalAffairsArray } from '../manageLegalAffairsInitials'

export const LegalCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 6 })
  )

  const monthTitle = useMemo<string>(
    () => formatWrapper(currentDate, 'MMMM yyyy') || '',
    [currentDate]
  )

  const weekNumberInMonth = useMemo<number>(() => getWeekOfMonth(currentDate), [
    currentDate,
  ])

  const weekDays = useMemo<Date[]>(
    () =>
      DAYS_OF_WEEK.map((_, index) =>
        add(currentDate, {
          days: index,
        })
      ),
    [currentDate]
  )

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [formattedEvents, setFormattedEvents] = useState<FormattedEvents>(
    initFormattedEvents
  )

  const formatEvents = () => {
    const modifiedEvents: FormattedEvents = {}

    weekDays.map((dayOfWeek, dayIndex) => {
      const filteredEventsOfWeekDay = events.filter((currentEvent) => {
        return isEqual(
          startOfDay(currentEvent.sessionDate),
          startOfDay(dayOfWeek)
        )
      })

      modifiedEvents[dayIndex] = filteredEventsOfWeekDay
    })
    setFormattedEvents(modifiedEvents)
  }

  const getEvents = async () => {
    const result = await getCalendarEvents({
      sessionFromDate: currentDate.getTime(),
      sessionToDate: add(currentDate, { weeks: 1 }).getTime(),
    })
    if (result.status === 'success' && result.body.events) {
      setEvents(result.body.events)
    }
  }

  const eventsMaxLength = useMemo<number>(() => {
    if (!formattedEvents) return 0
    const calcMax = Math.max(
      ...Object.entries(formattedEvents).map(
        (_, value) => formattedEvents[value].length
      )
    )
    return calcMax < MIN_ROWS ? MIN_ROWS : calcMax
  }, [formattedEvents])

  useEffect(() => {
    setFormattedEvents(initFormattedEvents)
    getEvents()
  }, [currentDate])

  useEffect(() => {
    events && formatEvents()
  }, [events])

  const prevWeek = useCallback(
    () => setCurrentDate(sub(currentDate, { weeks: 1 })),
    [currentDate]
  )
  const nextWeek = useCallback(
    () => setCurrentDate(add(currentDate, { weeks: 1 })),
    [currentDate]
  )

  const manageLegalAffairsTabs = manageLegalAffairsArray()
  return (
    <>
      <HeaderWithCards
        header={local.legalCalendar}
        array={manageLegalAffairsTabs}
        active={manageLegalAffairsTabs
          .map((item) => {
            return item.icon
          })
          .indexOf('encoding-files')}
      />
      <Card className="main-card">
        <Card.Body className="p-0">
          <div className="custom-card-header pb-5 dotted">
            <div className=" d-flex align-items-center">
              <Card.Title className="ml-5 mb-0 font-weight-bold">
                {monthTitle}
              </Card.Title>
              <Navigation
                title={WEEKS[weekNumberInMonth]}
                handlePrev={prevWeek}
                handleNext={nextWeek}
              />
            </div>
          </div>
          <Calendar
            daysOfWeek={DAYS_OF_WEEK}
            weekDaysDates={weekDays}
            eventsMaxLength={eventsMaxLength}
            events={formattedEvents}
          />
        </Card.Body>
      </Card>
    </>
  )
}
