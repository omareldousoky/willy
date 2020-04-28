import React from 'react';
import './styles.scss';

interface Element {
  icon: string;
  name: string;
}
interface Props {
  array: Array<Element>;
  // selectEl: (index: number) => void;
}
const DropDownList = (props: Props) => {
  return (
    <div className="drop-down-list">
      {props.array.map((item, index) => {
        return (
          <div key={index} 
          // onClick={() => props.selectEl(index)}
          >
            <span className={item.icon}></span>
            <span>{item.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default DropDownList;