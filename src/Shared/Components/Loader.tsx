import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

type Props = {
  open: boolean
  type: 'fullscreen' | 'fullsection' | 'inline'
}
export const Loader = (props: Props) => {
  function renderFullScreen() {
    return (
      <div className="loader-full-screen">
        <div className="cover" />
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: 100, height: 100 }}
        />
      </div>
    )
  }
  // To use fullsection type please make sure that it's parent has position absolute
  function renderFullSection() {
    return (
      <div className="loader-full-section">
        <div className="cover" />
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }
  function renderInline() {
    return <Spinner animation="border" variant="primary" />
  }
  if (props.open) {
    if (props.type === 'fullscreen') return renderFullScreen()
    if (props.type === 'fullsection') return renderFullSection()
    return renderInline()
  }
  return null
}
