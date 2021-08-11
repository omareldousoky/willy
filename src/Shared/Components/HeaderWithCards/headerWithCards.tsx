import React, { FunctionComponent } from 'react'
import './styles.scss'
import { NavLink } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import CardItem, { CardSize } from './HeaderWithCardsItem'

export interface Tab {
  icon?: string
  header: string
  desc?: string
  stringKey?: string
  path?: string | object
}

interface HeaderWithCardsProps {
  header?: string
  array: Array<Tab>
  active: number | string
  selectTab?: (index: string) => void
}

const HeaderWithCards: FunctionComponent<HeaderWithCardsProps> = ({
  header,
  array,
  active,
  selectTab,
}) => {
  return (
    <div className="header-cards-parent">
      <h4>{header}</h4>
      <div className="cards-container">
        <Nav>
          {array.map((item, index) => {
            const renderCard = (size: CardSize) => (
              <CardItem
                item={item}
                isActive={index === active}
                size={size}
                onClick={() => selectTab?.(item.stringKey || '')}
              />
            )

            return (
              <div className="card__wrapper" key={index}>
                {item.path ? ( // TODO: Add reliable key to check on instead of checking path
                  <NavLink
                    style={{ width: '100%', textDecoration: 'none' }}
                    to={item.path}
                  >
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

export default HeaderWithCards
