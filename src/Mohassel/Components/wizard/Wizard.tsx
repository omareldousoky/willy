import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Wizard.scss";
interface Step {
    description: any;
    highlighted: boolean;
    selected: boolean;
    completed: boolean;
}
interface Props{
    direction: string;
    currentStepNumber: number;
    stepColor: string;
    steps: any[];
    
};
interface State{
 steps: any[];
}
export default class Wizard extends Component  <Props , State>{
  constructor(props: Props) {
     super(props);

    this.state = {
      steps: []
    };
  }

  componentDidMount() {
    const { steps, currentStepNumber } = this.props;

    const stepsState = steps.map((step, index) => {
      const stepObj: any = {};
      stepObj.description = step;
      stepObj.highlighted = index === 0 ? true : false;
      stepObj.selected = index === 0 ? true : false;
      stepObj.completed = false;
      return stepObj;
    });

    const currentSteps = this.updateStep(currentStepNumber, stepsState);

    this.setState({
      steps: currentSteps
    });
  }

  componentDidUpdate(prevProps) {
    const { steps } = this.state;
    const currentSteps = this.updateStep(this.props.currentStepNumber, steps);

    if (prevProps.currentStepNumber !== this.props.currentStepNumber)
      this.setState({
        steps: currentSteps
      });
  }

  updateStep(stepNumber, steps) {
    const newSteps = [...steps];
    let stepCounter = 0;


    while (stepCounter < newSteps.length) {
    
      if (stepCounter === stepNumber) {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: true,
          selected: true,
          completed: false
        };
        stepCounter++;
      }

      else if (stepCounter < stepNumber) {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: false,
          selected: true,
          completed: true
        };
        stepCounter++;
      }
     
      else {
        newSteps[stepCounter] = {
          ...newSteps[stepCounter],
          highlighted: false,
          selected: false,
          completed: false
        };
        stepCounter++;
      }
    }

    return newSteps;
  }

  render() {
    const { direction, stepColor } = this.props;
    const { steps } = this.state;
    const renderedSteps = steps.map((step: Step, index) => {
      return (
        <div className="step-wrapper" key={index}>
          <div
            className={`step-number ${
              step.selected ? "step-number-selected" : "step-number-disabled"
            }`}
            style={{ background: `${step.selected ? stepColor : "none"}` }}
          >
            {step.completed ? <span>&#10003;</span> : index + 1}
          </div>
          <div
            className={`step-description ${step.highlighted &&
              "step-description-active"}`}
          >
            {step.description}
          </div>
          {index !== steps.length - 1 && (
            <div className={`divider-line divider-line-${steps.length}`} />
          )}
        </div>
      );
    });

    return <div className={`stepper-wrapper-${direction}`}>{renderedSteps}</div>;
  }
}
