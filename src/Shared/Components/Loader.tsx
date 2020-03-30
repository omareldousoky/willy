import React, { useState } from 'react';
import Spinner from "react-bootstrap/Spinner";

export const Loader = (props: any) => {
  const [loading, setLoading] = useState(true);
  // renderInline() {
  //   return <Spinner />
  // }
  // renderFullScreen() {
  //   return (
  //     <div className="loader-full-screen">
  //       <div className="cover"></div>
  //       <Spinner />
  //     </div>
  //   )
  // }
  // renderFullSection() {
  //   return (
  //     <div data-qc="ub4b1h66r76yjfkm" className="loader-full-section">
  //       <div data-qc="r22ofwiy3g6lc3rh" className="cover"></div>
  //       <Spinner />
  //     </div>
  //   )
  // }
  function render() {
    return (
      <div className="loader-fixed" style={{ left: `calc(50% - (${props.size}px / 2))` }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }
  if (loading) {
    // if (props.type === "inline") {
    //   return renderInline()
    // } else if (props.type === "fullscreen") {
    //   return renderFullScreen()
    // } else if (props.type === "fullsection") {
    //   return renderFullSection()
    // } else if (props.type === "fixed") {
    //   return renderFixed()
    // } else {
    //   return renderFullScreen()
    // }
    return render();
  }
  else {
    return <span id="LOADER">Loading...</span>
  }
}
