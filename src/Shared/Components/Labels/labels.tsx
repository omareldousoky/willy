import React, { Component } from 'react'

import './styles.scss'

interface State {
  selected: boolean
  item: number
}
interface Props {
  labelsTextArr: string[]
  isClickable?: boolean
  defaultSelect?: boolean
  onClick?: any
}

class Labels extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selected: !!this.props.defaultSelect,
      item: 0,
    }
  }

  handleClick = (index) => {
    if (this.props.isClickable) {
      this.setState({
        selected: true,
        item: index,
      })
      this.props.onClick(index)
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {this.props.labelsTextArr?.map((labelText, index) => {
          return (
            <span key={index} className={this.props.isClickable ? 'icon' : ''}>
              <div
                className={
                  this.props.isClickable
                    ? this.state.selected && index === this.state.item
                      ? 'labels-active-selected'
                      : 'labels-active'
                    : 'labels'
                }
                onClick={() => this.handleClick(index)}
              >
                {labelText}
              </div>
            </span>
          )
        })}
      </div>
    )
  }
}

export default Labels
