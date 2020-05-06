import React from 'react';
interface Props{

    labelText: string;
    labelStyle: any;
 
}

const Label = (props: Props) => {
    
    return (
        <div style={props.labelStyle}>
            {props.labelText}
        </div>
    )
}

export default Label
