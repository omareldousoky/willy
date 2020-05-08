import React, { CSSProperties } from 'react';
import {useHistory} from 'react-router-dom';
import {theme} from'../../../theme';

interface Props{
    title: string;

}
const buttonStyle: CSSProperties = {
    display:"flex",
    flexDirection:'row',
    textAlign:'right',
    color: theme.colors.blackText,
    margin: '1rem',
    justifyContent:'space-between',
    alignItems:'center',
   
}
const BackButton = (props: Props)  => {
    const history = useHistory();
    return (
        <div style ={buttonStyle}>
             <span style={{margin:"20px"}}>
                <img alt="backButton" onClick= {()=>{history.goBack()}} src={require('../../Assets/backIcon.svg')}/>
             <span style={{marginRight:"1rem"}}> {props.title} </span>
             </span>
        </div>
    );
    }

export default BackButton;
