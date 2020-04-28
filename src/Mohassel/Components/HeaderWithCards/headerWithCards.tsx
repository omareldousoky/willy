import React from 'react';
import './styles.scss';

interface Tab {
  icon: string;
  header: string;
  desc?: string;
}
interface Props {
  header: string;
  array: Array<Tab>;
  active: number;
  selectTab: (index: number) => void;
}
const HeaderWithCards = (props: Props) => {
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

export default HeaderWithCards;