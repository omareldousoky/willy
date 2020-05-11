import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Wizard.scss";
interface Step {
    description: string;
    selected: boolean;
    completed: boolean;
}
interface Props{
    currentStepNumber: number;
    stepsDescription: string[];
    
};
interface State{
 steps: Step[];
}
export default class Wizard extends Component  <Props , State>{
  constructor(props: Props) {
     super(props);

    this.state = {
      steps: []
    };
  }
  resetStateStepsSelection(steps: Step[]) {
    return steps.forEach(step => {
      step.selected =false;
    });

  }

  componentDidMount() {
    const { stepsDescription } = this.props;

    const stepsState = stepsDescription.map((stepDescription, index) => {
      const stepObj: Step = {
        description : stepDescription,
        selected : index === 0 ? true : false,
        completed : false,
      };
     
      return stepObj;
    });

    this.setState({
      steps: stepsState
    });
  }
  

  componentDidUpdate (previousProps){
    if(previousProps.currentStepNumber !== this.props.currentStepNumber){
      const index = this.props.currentStepNumber;
    const stepsState = this.state.steps;
    this.resetStateStepsSelection(stepsState);
    stepsState[index].selected =true;
    
     if(index >0 && index< this.state.steps.length){
       
          stepsState[index-1].completed =true;
          stepsState[index-1].selected = false;
          
     }
     this.setState({steps:stepsState});
    }
  }


   render() {
    const { steps } = this.state;
    const renderedSteps = steps.map((step: Step, index) => {
      return (
        <div className="step-wrapper" key={index}>
          <div
            className={`step-description ${(step.completed||step.selected) && "step-visited"}`} 
          >
            {step.description}
          </div>
         
            {
              (step.completed && step.selected === false)&& <div className={"selected-circile"}></div>
            }
           { step.selected && <>
            <div className={"outer"}>
            <div className={ "inner" } > </div> </div>
             </>
           }
           { step.completed && 
             
            <div className={"divider-line"} > </div>
            
           }
        </div>
      );
    });

    return (
      <div className="stepper-container-vertical">
       <div className={`stepper-wrapper-vertical`}>
      {renderedSteps}
      </div>
    </div>
    );
  }
}
