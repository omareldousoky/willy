import React from 'react'
import './style.scss'

import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

import isToday from 'date-fns/isToday'

import local from '../../../Shared/Assets/ar.json'
import { CalendarProps } from './types'
import { EventDetails } from './EventDetails'

export const Calendar = ({
  daysOfWeek,
  weekDaysDates,
  eventsMaxLength,
  events,
}: CalendarProps) => {
  return (
    <Container fluid>
      <Table responsive="md" bordered className="calendar" size="lg">
        <thead>
          <tr>
            {daysOfWeek.map((day, weekIndex) => {
              const today = isToday(weekDaysDates[weekIndex])
              return (
                <th key={weekIndex} className="text-center">
                  <span className={`${today && ' text-primary'}`}>{day}</span>
                  <span
                    className={`d-block my-2 font-weight-bolder ${
                      today && 'active-day'
                    }`}
                  >
                    {weekDaysDates[weekIndex].getDate()}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: eventsMaxLength }).map((_, cellIndex) => (
            <tr key={cellIndex}>
              {events &&
                Array.from({ length: 6 }).map((__, dayIndex) => {
                  const currentEvent = events[dayIndex][cellIndex]

                  return (
                    <td
                      className={`text-light font-weight-bold event-cell ${
                        currentEvent && 'event-cell--active'
                      }`}
                      key={dayIndex}
                    >
                      <OverlayTrigger
                        trigger="click"
                        placement="right"
                        overlay={
                          <Popover
                            id="popover-basic"
                            style={{ minWidth: '377px', minHeight: '377px' }}
                          >
                            {currentEvent && (
                              <EventDetails event={currentEvent} />
                            )}
                          </Popover>
                        }
                        rootClose
                      >
                        {currentEvent ? (
                          <div style={{ height: '100%' }} className="w-100 p-1">
                            <p>{currentEvent.customerName}</p>
                            <p className="font-weight-light">
                              {local[currentEvent.sessionType]}
                            </p>
                          </div>
                        ) : (
                          <div />
                        )}
                      </OverlayTrigger>
                    </td>
                  )
                })}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
