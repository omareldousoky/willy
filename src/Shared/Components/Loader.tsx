import React from 'react';
import PropTypes from 'prop-types';
import Spinner from "react-bootstrap/Spinner";

type Props = {
  open: boolean;
  type: string;
}
export const Loader = (props: Props) => {
  function renderFullScreen() {
    return (
      <div className="loader-full-screen">
        <div className="cover"></div>
        <Spinner animation="border" variant="primary" style={{ width: 100, height: 100 }} />
      </div>
    )
  }
  //To use fullsection type please make sure that it's parent has position absolute
  function renderFullSection() {
    return (
      <div className="loader-full-section">
        <div className="cover"></div>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }
  function renderInline() {
    return <Spinner animation="border" variant="primary" />
  }
  if (props.open) {
    if (props.type === "fullscreen")
      return renderFullScreen();
    else if (props.type === "fullsection")
      return renderFullSection();
    else return renderInline();
  }
  else return null;
}

Loader.propTypes = {
  open: PropTypes.bool, // true to open loader and false to close it
  type: PropTypes.string // ['fullscreen' or 'fullsection' or 'inline']
};