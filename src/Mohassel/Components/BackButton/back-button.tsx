import React, { CSSProperties } from 'react'
import { useHistory } from 'react-router-dom'
import { theme } from '../../../theme'

interface Props {
  title: string
  className?: string | undefined
}
const buttonStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  textAlign: 'right',
  color: theme.colors.blackText,
  margin: '1rem',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
}
const BackButton = (props: Props) => {
  const history = useHistory()
  return (
    <div style={buttonStyle} className={props.className ? props.className : ''}>
      <span style={{ margin: '20px' }}>
        <img
          alt="backButton"
          onClick={() => {
            history.goBack()
          }}
          src={require('../../Assets/backIcon.svg')}
        />
        <span style={{ marginRight: '1rem' }}> {props.title} </span>
      </span>
    </div>
  )
}

export default BackButton
