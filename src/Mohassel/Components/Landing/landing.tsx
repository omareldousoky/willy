import React from 'react';
import Can from '../../config/Can';
import * as local from '../../../Shared/Assets/ar.json';
import LoanContract from '../pdfTemplates/loanContract/loanContract';
export const Landing = () => {
    return (
        <>
        <h1 style={{textAlign: 'right', margin: 20}}>{local.welcomeToMohassel}</h1>
        <LoanContract></LoanContract>
        </>
    )
}