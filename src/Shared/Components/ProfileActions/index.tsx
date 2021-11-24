import React from 'react'
import Button from 'react-bootstrap/Button'

import { LtsIcon } from '../LtsIcon'
import { Loader } from '../Loader'
import { ProfileActionsProps } from './types'

export const ProfileActions = ({ actions }: ProfileActionsProps) => {
  return (
    <div className="d-flex justify-content-end">
      {actions.map((action, index) => {
        const { title, permission, onActionClick, isLoading } = action
        return isLoading ? (
          <Loader type="inline" open />
        ) : (
          permission && (
            <Button
              variant="default"
              key={index}
              className="profile-action-btn"
              onClick={onActionClick}
            >
              {action.icon && (
                <LtsIcon name={action.icon} className="align-middle pr-2" />
              )}
              <span className="text-mixed-lang text-nowrap mx-auto my-2">
                {title}
              </span>
            </Button>
          )
        )
      })}
    </div>
  )
}
