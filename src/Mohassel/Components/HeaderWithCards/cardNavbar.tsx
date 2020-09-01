import React from 'react';
import './styles.scss';
import Can from '../../config/Can';

export interface Tab {
  icon?: string;
  header?: string;
  desc?: string;
  stringKey: string;
  permission?: string;
  permissionKey?: string;
}
interface Props {
  header: string;
  array: Array<Tab>;
  active: number | string;
  selectTab: (index) => void;
}
export const CardNavBar = (props: Props) => {
  return (
    <div className="cards-container">
      {props.array.map((item, index) => {
        if (item.permission && item.permission.length > 0 && item.permissionKey && item.permissionKey.length > 0) {
          return (
            <Can I={item.permission} a={item.permissionKey} key={index} >
              <div key={index} className={item.stringKey === props.active ? "navBar-item active" : "navBar-item"} onClick={() => props.selectTab(item.stringKey)}>
                <div style={{ margin: 'auto 0px' }}>
                  <h6>{item.header}</h6>
                </div>
              </div>
            </Can>
          )
        } else {
          return (
            <div key={index} className={item.stringKey === props.active ? "navBar-item active" : "navBar-item"} onClick={() => props.selectTab(item.stringKey)}>
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