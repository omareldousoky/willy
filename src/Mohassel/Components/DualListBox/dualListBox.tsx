import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import './styles.scss';
import * as local from '../../../Shared/Assets/ar.json';

interface Props {
    options: any;
    selected: any;
    onChange: any;
    filterKey: string;
    rightHeader?: string;
    leftHeader?: string;
}

interface State {
    options: Array<any>;
    selectedOptions: Array<any>;
    selectedOptionsIDs: Array<any>;
    selectionArray: Array<any>;
    filterKey: string;
    checkAll: boolean;
    searchKeyword: string;
    searchSelectedKeyWord: string;
}
class DualBox extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            options: [],
            selectedOptions: [],
            selectedOptionsIDs: [],
            selectionArray: [],
            filterKey: '',
            checkAll: false,
            searchKeyword: '',
            searchSelectedKeyWord: ''
        }
    }
    static getDerivedStateFromProps(props, state) {
        if ((props.filterKey !== state.filterKey)) {
            const selectedIds = props.selected.map(item => item._id);
            return {
                filterKey: props.filterKey,
                options: props.options.filter(item => !selectedIds.includes(item._id)),
                selectedOptions: props.selected
            }
        }
        return null;
    }
    componentDidUpdate(prevProps) {
        if (this.props.filterKey !== prevProps.filterKey) {
            this.setState({ filterKey: this.props.filterKey })
        }
    }
    selectItem = (option) => {
        const arr: Array<any> = this.state.selectionArray;
        if (!arr.includes(option)) {
            arr.push(option)
        } else {
            const index = arr.indexOf(option);
            if (index !== -1) arr.splice(index, 1);
        }
        this.setState({ selectionArray: arr })
    }
    addToSelectedList() {
        let options = [...this.state.options];
        this.state.selectionArray.forEach(el => {
            options = options.filter(item => item.productName !== el.productName);
        })
        const newList = [...this.state.selectedOptions, ...this.state.selectionArray];
        this.props.onChange(newList);
        this.setState({
            options: options,
            selectedOptions: newList,
            selectionArray: []
        })
    }
    removeItemFromList(option) {
        this.setState({
            selectedOptions: this.state.selectedOptions.filter(item => item._id !== option._id),
            options: [...this.state.options, option]
        })
    }
    selectAllOptions() {
        if (this.state.checkAll) {
            this.setState({
                selectionArray: [],
                checkAll: false
            })
        } else {
            this.setState({
                selectionArray: [...this.state.options],
                checkAll: true
            })
        }
    }
    removeAllFromList() {
        this.setState({
            options: [...this.state.options, ...this.state.selectedOptions],
            selectedOptions: []
        })
    }
    render() {
        return (
            <div className="container" style={{ marginTop: 20 }}>
                <div className="row">
                    <div className="dual-list list-left col-md-5">
                        <div className="well text-right">
                            <h6>{this.props.rightHeader}</h6>
                            <ul className="list-group">
                                <InputGroup style={{ direction: 'ltr' }}>
                                    <Form.Control
                                        type="text"
                                        name="searchKeyWord"
                                        data-qc="searchKeyWord"
                                        onChange={(e) => this.setState({ searchKeyword: e.currentTarget.value })}
                                        style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                                        placeholder={local.search}
                                    />
                                    <InputGroup.Append>
                                        <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                                <div className="list-group-item" style={{ background: '#FAFAFA' }} onClick={() => this.selectAllOptions()} >
                                    <Form.Check
                                        type='checkbox'
                                        readOnly
                                        id='check-all'
                                        label={local.checkAll}
                                        checked={this.state.checkAll}
                                    />
                                </div>
                                <div className="scrollable-list">
                                    {this.state.options
                                        .filter(option => option.productName.toLocaleLowerCase().includes(this.state.searchKeyword.toLocaleLowerCase()))
                                        .map(option =>
                                            <div key={option._id} onClick={() => this.selectItem(option)}
                                                className={(this.state.selectionArray.findIndex((item) => item.productName === option.productName) > -1) ? "list-group-item selected" : "list-group-item"}>
                                                <Form.Check
                                                    type='checkbox'
                                                    // readOnly
                                                    id={option._id}
                                                    onChange={() => this.selectItem(option)}
                                                    label={option.productName}
                                                    checked={this.state.selectionArray.findIndex((item) => item.productName === option.productName) > -1}
                                                />
                                            </div>
                                        )}
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="list-button">
                        <Button className="btn btn-default btn-md" style={{ height: 45, width: 95 }} disabled={this.state.selectionArray.length < 1} onClick={() => this.addToSelectedList()}>
                            {local.add}<span className="fa fa-arrow-left"></span>
                        </Button>
                    </div>
                    <div className="dual-list list-right col-md-5">
                        <div className="well text-right">
                            <h6 className="text-muted">{this.props.leftHeader}</h6>
                            <ul className="list-group">
                                <InputGroup style={{ direction: 'ltr' }}>
                                    <Form.Control
                                        type="text"
                                        name="searchSelectedKeyWord"
                                        data-qc="searchSelectedKeyWord"
                                        onChange={(e) => this.setState({ searchSelectedKeyWord: e.currentTarget.value })}
                                        style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                                        placeholder={local.search}
                                    />
                                    <InputGroup.Append>
                                        <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                                <div className="list-group-item delete-all-row" style={{ background: '#FAFAFA' }}>
                                    <span className="text-muted">{local.count}({this.state.selectedOptions.length})</span>
                                    <div onClick={() => this.removeAllFromList()}>
                                        <span className="fa fa-trash"></span>
                                        <span>{local.deleteAll}</span>
                                    </div>
                                </div>
                                <div className="scrollable-list">
                                    {this.state.selectedOptions
                                        .filter(option => option.productName.toLocaleLowerCase().includes(this.state.searchSelectedKeyWord.toLocaleLowerCase()))
                                        .map(option => <li key={option._id}
                                        className="list-group-item"><span className="fa fa-times" onClick={() => this.removeItemFromList(option)}></span>{option.productName}</li>)}
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default DualBox