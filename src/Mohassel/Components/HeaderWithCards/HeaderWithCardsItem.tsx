import React, { FunctionComponent } from 'react'
import { Tab } from './headerWithCards'

export type CardSize = 'lg' | 'sm'

type CardItemProps = {
  item: Tab
  onClick?: () => void
  size?: CardSize
  isActive: boolean
}

const getSizeClassName = (size: CardSize) => {
  switch (size) {
    case 'lg':
      return 'h5'
    case 'sm':
      return 'h6 font-weight-bold'
    default:
      return 'h3'
  }
}

const CardItem: FunctionComponent<CardItemProps> = ({
  item: { header, desc, icon },
  onClick,
  size = 'lg',
  isActive,
}) => (
  <div onClick={onClick} className={`card-item ${isActive ? 'active' : ''}`}>
    {icon && (
      <img
        alt="icon"
        src={
          isActive
            ? require(`../../Assets/${icon}-active.svg`)
            : require(`../../Assets/${icon}-inactive.svg`)
        }
      />
    )}
    <div>
      <h5 className={getSizeClassName(size)}>{header}</h5>
      <p>{desc}</p>
    </div>
  </div>
)

export default CardItem
