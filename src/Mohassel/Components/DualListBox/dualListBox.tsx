import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import './styles.scss';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
    options: any;
    selected: any;
    onChange: any;
}

interface State {
    options: Array<any>;
    selectedOptions: Array<any>;
    selectedOptionsIDs: Array<any>;
    selectionArray: Array<any>;
}
const getData2 = (selectedIdArray, objArr) => {
    const selectedOptions: Array<any> = [];
    const selectedOptionsIDs: Array<string> = [];
    selectedIdArray.forEach(selectedOption => {
        const foundOption = objArr.find((option) => option.value === selectedOption)
        console.log(selectedOption, foundOption)
        if (foundOption) {
            selectedOptions.push(foundOption);
            selectedOptionsIDs.push(foundOption.value);
        }
    })
    const options: Array<any> = objArr.filter(option => !selectedOptionsIDs.includes(option.value));
    return ({
        options,
        selectedOptions,
        selectedOptionsIDs,
    })
}
class DualBox extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            options: [],
            selectedOptions: [],
            selectedOptionsIDs: [],
            selectionArray: []
        }
    }
    componentDidMount() {
        this.setData(this.state.selectedOptions, this.state.options)
    }
    static getDerivedStateFromProps(props, state) {
        console.log(props, state)
        if (props.options.length !== state.options.length || props.selected.length !== state.selectedOptions.length) {
            const data = getData2(props.selected, props.options);
            return { options: data.options, selectedOptions: data.selectedOptions }
        }
        return null
    }
    componentDidUpdate(prevProps: Props) {
        console.log('pre --->', prevProps, this.props)
        if (prevProps.options.length !== this.props.options.length || prevProps.selected.length !== this.props.selected.length) {
            console.log('here')
            //set State to initial value
            // I need to add application id in the form values to be passed to status helper component
            this.setData(this.state.selectedOptions, this.state.options)

        }
    }
    setData(selected, options) {
        const data = getData2(selected, options);
        this.setState({
            options: data.options,
            selectedOptions: data.selectedOptions,
            selectedOptionsIDs: data.selectedOptionsIDs
        })
    }
    selectItem = (from, option) => {
        console.log(from, option)
        const arr: Array<any> = this.state.selectionArray;
        if (!arr.includes(option.value)) {
            arr.push(option.value)
        } else {
            const index = arr.indexOf(option.value);
            if (index !== -1) arr.splice(index, 1);
        }
        this.setState({ selectionArray: arr })
    }
    render() {
        return (
            <div className="container">
                <br />
                <div className="row">

                    <div className="dual-list list-left col-md-5">
                        <div className="well text-right">
                            <div className="row">
                                <div className="col-md-10">
                                    <div className="input-group">
                                        <span className="input-group-addon glyphicon glyphicon-search"></span>
                                        <input type="text" name="SearchDualList" className="form-control" placeholder="search" />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="btn-group">
                                        <a className="btn btn-default selector" title="select all"><i className="fa fa-square"></i></a>
                                    </div>
                                </div>
                            </div>
                            <ul className="list-group">
                                {this.state.options.map(option => <li key={option.value} onClick={() => this.selectItem('options', option)} className={(this.state.selectionArray.includes(option.value)) ? "list-group-item-selected" : "list-group-item"}>{option.label}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="list-arrows col-md-1 text-center">
                        <button className="btn btn-default btn-sm move-right">
                            <span className="fa fa-chevron-right"></span>
                        </button>
                        <button className="btn btn-default btn-sm move-left">
                            <span className="fa fa-chevron-left"></span>
                        </button>
                    </div>

                    <div className="dual-list list-right col-md-5">
                        <div className="well">
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="btn-group">
                                        <a className="btn btn-default selector" title="select all"><i className="fa fa-check-square"></i></a>
                                    </div>
                                </div>
                                <div className="col-md-10">
                                    <div className="input-group">
                                        <input type="text" name="SearchDualList" className="form-control" placeholder="search" />
                                        <span className="input-group-addon glyphicon glyphicon-search"></span>
                                    </div>
                                </div>
                            </div>
                            <ul className="list-group">
                                {this.state.selectedOptions.map(option => <li key={option.value} onClick={() => this.selectItem('selected', option)} className={(this.state.selectionArray.includes(option.value)) ? "list-group-item-selected" : "list-group-item"}>{option.label}</li>)}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
export default DualBox