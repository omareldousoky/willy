import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import './styles.scss';
// import * as local from '../../../Shared/Assets/ar';

interface Props {
    options: any;
    selected: any;
    onChange: any;
}

const DualBox = (props: Props) => {
    console.log(props.selected, props.options)
    const selectedOptions: Array<any> = [];
    const selectedOptionsIDs: Array<string> = [];
    props.selected.forEach(selectedOption => {
        const foundOption = props.options.find((option) => option.value === selectedOption)
        console.log(props.options,selectedOption,foundOption)
        if(foundOption){
            selectedOptions.push(foundOption);
            selectedOptionsIDs.push(foundOption.value);
        }
    })
    
    const options: Array<any> = props.options.filter(option => !selectedOptionsIDs.includes(option.value));
    console.log(selectedOptions, props.options)
    console.log(props.options.filter(option => !selectedOptionsIDs.includes(option.value)))
    return (
        <div className="d-flex box">
            <div className="listBox">
                <ul className="list">
                    {options.map(option =>
                        <li className="listItem" key={option.value}>
                            {option.label}
                        </li>

                    )}
                </ul>
            </div>
            <div className="listBox">
                <ul className="list">
                    {selectedOptions.map(option =>
                        <li className="listItem" key={option.value}>
                            {option.label}
                        </li>

                    )}
                </ul>
            </div>

        </div>
    )
}

export default DualBox