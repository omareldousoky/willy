import React from 'react';
import Can from '../../config/Can';
import * as local from '../../../Shared/Assets/ar.json';
// import UnpaidInst from '../pdfTemplates/unpaidInst/unpaidInst'
export const Landing = () => {
    return (
        <>
            {/* <div className="print-none"> */}
                <h1 style={{ textAlign: 'right', margin: 20 }}>{local.welcomeToMohassel}</h1>
                {/* <button onClick={() => window.print()}>PRINT</button> */}
            {/* </div> */}
            {/* <UnpaidInst /> */}
        </>
    )
}