import React from 'react';
import './styles.scss';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import CardItem, { CardSize } from './HeaderWithCardsItem';

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
  
  selectTab?: (index: string) => void;
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
          <Nav>
            {this.props.array.map((item, index) => {
              const renderCard = (size: CardSize) => (
                <CardItem
                  item={item}
                  isActive={index === this.props.active}
                  size={size}
                  onClick={() => this.props.selectTab?.(item.stringKey || '')}
                />
              );

              return (
                <div className="card__wrapper" key={index}>
                  {item.path ? ( // TODO: Add reliable key to check on instead of checking path
                    <NavLink style={{width: '100%', textDecoration: 'none'}} to={item.path}>
                      {renderCard('lg')}
                    </NavLink>
                  ) : (
                    renderCard('sm')
                  )}
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