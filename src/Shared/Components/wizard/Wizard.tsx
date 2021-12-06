import React, { Component } from 'react'
import './Wizard.scss'

interface Step {
  description: string
  selected: boolean
  completed: boolean
}
interface Props {
  currentStepNumber: number
  stepsDescription: string[]
  edit?: boolean
  onClick?: any
}
interface State {
  steps: Step[]
}

// TODO:lint: convert to FC
export default class Wizard extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      steps: [],
    }
  }

  componentDidMount() {
    const { stepsDescription } = this.props

    const stepsState = stepsDescription.map((stepDescription, index) => {
      const stepObj: Step = {
        description: stepDescription,
        selected: index === 0,
        completed: false,
      }

      return stepObj
    })

    this.setState({
      steps: stepsState,
    })
  }

  componentDidUpdate(previousProps) {
    if (previousProps.currentStepNumber !== this.props.currentStepNumber) {
      const index = this.props.currentStepNumber
      const stepsState = this.state.steps
      this.resetStateStepsSelection(stepsState)
      stepsState[index].selected = true

      if (index > 0 && index < this.state.steps.length) {
        stepsState[index - 1].completed = true
        stepsState[index - 1].selected = false
      }
      this.updateSteps(stepsState)
    }
  }

  handleClick(index) {
    if (this.props.edit) {
      this.props.onClick(index)
    }
  }

  updateSteps = (steps) => {
    this.setState({ steps })
  }

  resetStateStepsSelection(steps: Step[]) {
    return steps.forEach((step) => {
      step.selected = false
    })
  }

  render() {
    const { steps } = this.state
    const renderedSteps = steps.map((step: Step, index) => {
      return (
        <div
          className={
            this.props.edit ? 'step-wrapper steps-interactive' : 'step-wrapper'
          }
          key={index}
          onClick={() => this.props.onClick && this.handleClick(index)}
        >
          <div
            className={`step-description ${
              (step.completed || step.selected || this.props.edit) &&
              'step-visited'
            }`}
          >
            {step.description}
          </div>

          {((step.completed && step.selected === false) || this.props.edit) && (
            <div className="selected-circile" />
          )}
          {step.selected && (
            <>
              <div className="outer">
                <div className="inner"> </div>
              </div>
            </>
          )}
          {(step.completed ||
            (this.props.edit && index < steps.length - 1)) && (
            <div className="divider-line"> </div>
          )}
        </div>
      )
    })

    return (
      <div className="stepper-container-vertical">
        <div className="stepper-wrapper-vertical">{renderedSteps}</div>
      </div>
    )
  }
}
