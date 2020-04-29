import React from 'react';
import './styles.scss';

export interface Tab {
  icon?: string;
  header: string;
  desc?: string;
  stringKey?: string;
}
interface Props {
  header: string;
  array: Array<Tab>;
  active: number|string;
  selectTab: (index) => void;
}
export const HeaderWithCards = (props: Props) => {
  return (
    <div className="header-cards-parent">
      <h4>{props.header}</h4>
      <div className="cards-container">
        {props.array.map((item, index) => {
          return (
            <div key={index} className={index === props.active ?"card-item active":"card-item"} onClick={() => props.selectTab(index)}>
              <img alt="icon" src={index === props.active ? require(`../../Assets/${item.icon}-active.svg`) : require(`../../Assets/${item.icon}-inactive.svg`)} />
              <div style={{margin: 'auto 0px'}}>
                <h5>{item.header}</h5>
                <p>{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
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