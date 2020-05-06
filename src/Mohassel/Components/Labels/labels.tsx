import React from 'react'
import Label from './label'


interface Props{

    labelsTextArr?: string[];
    labelColor: string;
    labelBackground: string;
    fontSize: string;
}

const Labels = (props: Props) => {
    const styles={
        color: props.labelColor,
        backgroundColor: props.labelBackground,
        borderRadius: "20px",
        fontSize: props.fontSize,
        textAlign:"center",
        fontWeight: "normal",
        marginRight:"10px",
        padding:".5rem",
       }
    return (
        <div style={{display:"flex",flexDirection:'row'}}>
            { props.labelsTextArr?.map((labelText,index)=>{
                return (
                <Label 
                key={index}
                labelText = {labelText}
                labelStyle = {styles}
                 />
                )
            })
            
            }
        </div>
    )
}

export default Labels;
