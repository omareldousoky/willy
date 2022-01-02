import React from 'react'
import './styles.scss'
import Can from '../../config/Can'
import ability from '../../config/ability'

export interface Tab {
  icon?: string
  header?: string
  desc?: string
  stringKey: string
  permission?: string | string[]
  permissionKey?: string
}
interface Props {
  array: Array<Tab>
  active: number | string
  selectTab: (index) => void
  isVertical?: boolean
}
export const CardNavBar = (props: Props) => {
  return (
    <div
      className={`cards-container ${
        props.isVertical ? 'd-flex flex-column' : ''
      }`}
    >
      {props.array.map((item, index) => {
        if (
          item.permission &&
          item.permission.length > 0 &&
          item.permissionKey &&
          item.permissionKey.length > 0 &&
          !Array.isArray(item.permission)
        ) {
          return (
            <Can I={item.permission} a={item.permissionKey} key={index}>
              <div
                key={index}
                className={`navBar-item ${
                  item.stringKey === props.active ? 'active' : ''
                } ${
                  props.isVertical
                    ? 'justify-content-start'
                    : 'justify-content-center'
                }`}
                onClick={() => props.selectTab(item.stringKey)}
              >
                <div style={{ margin: 'auto 0px' }}>
                  <h6>{item.header}</h6>
                </div>
              </div>
            </Can>
          )
        }
        if (
          item.permission &&
          item.permission.length > 0 &&
          item.permissionKey &&
          item.permissionKey.length > 0 &&
          Array.isArray(item.permission)
        ) {
          let arr = 0
          item.permission.forEach((perm: string) => {
            if (ability.can(perm, item.permissionKey)) {
              arr += 1
            }
          })
          if (arr > 0) {
            return (
              <div
                key={index}
                className={
                  item.stringKey === props.active
                    ? 'navBar-item active'
                    : 'navBar-item'
                }
                onClick={() => props.selectTab(item.stringKey)}
              >
                <div style={{ margin: 'auto 0px' }}>
                  <h6>{item.header}</h6>
                </div>
              </div>
            )
          }
        } else {
          return (
            <div
              key={index}
              className={
                item.stringKey === props.active
                  ? 'navBar-item active'
                  : 'navBar-item'
              }
              onClick={() => props.selectTab(item.stringKey)}
            >
              <div style={{ margin: 'auto 0px' }}>
                <h6>{item.header}</h6>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}
