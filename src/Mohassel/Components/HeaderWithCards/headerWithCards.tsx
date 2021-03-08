import React from 'react';
import './styles.scss';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
export interface Tab {
  icon?: string;
  header: string;
  desc?: string;
  stringKey?: string;
  path?: string;
}
interface Props {
  header: string;
  array: Array<Tab>;
  active: number|string;
}
class HeaderWithCards extends React.Component <Props> {
  constructor(props: Props){
    super(props);
  }
  render () {
  return ( 
    <div className="header-cards-parent">
      <h4>{this.props.header}</h4>
      <div className="cards-container">
        <Nav style={{ overflow: 'auto', flexWrap: 'nowrap'}}>
        {this.props.array.map((item, index) => {
          return (
            <div key={index} className={index === this.props.active ?"card-item active":"card-item"}>
              <NavLink  key={index} to = {item.path}  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} >
              {item.icon && <img alt="icon" src={index === this.props.active ? require(`../../Assets/${item.icon}-active.svg`) : require(`../../Assets/${item.icon}-inactive.svg`)} />}
              <div style={{margin: 'auto 0px'}}>
                <h5>{item.header}</h5>
                <p>{item.desc}</p>
              </div>
             </NavLink>
            </div>
        
          )
        })}
        </Nav>
      </div>
    </div>
  )
 }
}
 


export default HeaderWithCards;