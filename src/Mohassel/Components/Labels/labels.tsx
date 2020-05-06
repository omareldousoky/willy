import React  ,{ Component} from 'react';

import './styles.scss'

interface State {
 selected: boolean;
 item: number;
}
interface Props{
    labelsTextArr?: string[];
    isClickable?: boolean;
    onClick?: () => void;
}

class Labels extends Component<Props,State>  {
    constructor(props: Props){
        super(props);
        this.state={
            selected: false,
            item: 0,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(index){
        this.setState({
            selected:true,
            item:index,
        })
      }
   render() {
    return (
        <div style={{display:"flex",flexDirection:'row'}}>
            { this.props.labelsTextArr?.map((labelText,index)=>{
                return (
                    <div 
                    key={index}  
                    className={this.props.isClickable? (this.state.selected && index == this.state.item)? 'labels-active-selected': 'labels-active':'labels'} 
                    onClick={()=>{this.handleClick(index),this.props.onClick}} >
                    {labelText}
                   </div>
                )
            })
            
            }
        </div>
    )
        }
}

export default Labels;
