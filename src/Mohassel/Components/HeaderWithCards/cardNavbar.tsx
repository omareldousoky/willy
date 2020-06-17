import React from 'react';
import './styles.scss';

export interface Tab {
    icon?: string;
    header?: string;
    desc?: string;
    stringKey?: string;
  }
interface Props {
    header: string;
    array: Array<Tab>;
    active: number|string;
    selectTab: (index) => void;
  }
export const CardNavBar =(props: Props) => {
    return (
        <div className="cards-container">
          {props.array.map((item, index) => {
            return (
              <div key={index} className={item.stringKey === props.active ?"navBar-item active":"navBar-item"} onClick={() => props.selectTab(item.stringKey)}>
                <div style={{margin: 'auto 0px'}}>
                  <h6>{item.header}</h6>
                </div>
              </div>
            )
          })}
        </div>
    )
  }