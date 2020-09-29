import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import './styles.scss';
import * as local from '../../../Shared/Assets/ar.json';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from 'sweetalert2';

interface Props {
    options: any;
    vertical?: boolean;
    selected: any;
    labelKey: string;
    onChange: any;
    filterKey: string;
    rightHeader?: string;
    leftHeader?: string;
    search?: Function;
    dropDownKeys?: Array<string>;
    viewSelected?: Function;
    disabled?: Function;
    disabledMessage?: string;

}

interface State {
    options: Array<any>;
    selectedOptions: Array<any>;
    selectedOptionsIDs: Array<any>;
    selectionArray: Array<any>;
    filterKey: string;
    dropDownValue: string;
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
            dropDownValue: 'name',
            checkAll: false,
            searchKeyword: '',
            searchSelectedKeyWord: ''
        }
    }


    static getDerivedStateFromProps(props, state) {
        if (props.filterKey !== state.filterKey || props.options !== state.options) {
            if (props.selected?.length > 0) {
                const selectedIds = props.selected.map(item => item._id);

                return {
                    filterKey: props.filterKey,
                    options: props.options.filter(item => !selectedIds.includes(item._id)),
                    selectedOptions: props.selected
                }
            }
            else {
                return {
                    filterKey: props.filterKey,
                    options: props.options,
                }
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
        if (!arr.find((element) => option._id === element._id)) {
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
            options = options.filter(item => item[this.props.labelKey] !== el[this.props.labelKey]);
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
        const newList = this.state.selectedOptions.filter(item => item._id !== option._id);
        this.props.onChange(newList);
        this.setState({
            selectedOptions: newList,
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
                selectionArray: (this.props.disabled) ? this.state.options.filter(option => this.props.disabled && this.props.disabled(option) === false) : [...this.state.options],
                checkAll: true
            })
        }
    }
    removeAllFromList() {
        this.props.onChange([]);
        this.setState({
            options: [...this.state.options, ...this.state.selectedOptions],
            selectedOptions: []
        })
    }
    handleSearch(e) {
        if (this.props.search && this.props.dropDownKeys && this.props.dropDownKeys.length > 0 && e && ['code', 'key', 'nationalId'].includes(this.state.dropDownValue) && isNaN(Number(e))) {
            Swal.fire("warning", local.onlyNumbers, 'warning')
        } else {
            this.setState({ searchKeyword: e }, () => {
                if (this.props.search && this.props.dropDownKeys && this.props.dropDownKeys.length > 0) {
                    this.props.search(this.state.searchKeyword, this.state.dropDownValue)
                }
            })
        }
    }
    viewSelected(id) {
        if (this.props.viewSelected) { this.props.viewSelected(id) }
    }
    getArValue(key: string) {
        switch (key) {
            case 'name': return local.name;
            case 'nationalId': return local.nationalId;
            case 'key': return local.code;
            case 'code': return local.partialCode;
            default: return '';
        }
    }
    render() {
        return (
            <div className="container" style={{ marginTop: 20, textAlign: 'right' }}>
                <div className={!this.props.vertical ? "row-nowrap" : "d-flex flex-column justify-content-center"}>
                    <div className={!this.props.vertical ? 'dual-list list-left col-md-5' : 'dual-list list-left'}>
                        <div className="well text-right">
                            <h6>{this.props.rightHeader}</h6>
                            <ul className="list-group">
                                <InputGroup style={{ direction: 'ltr' }}>
                                    <Form.Control
                                        type="text"
                                        name="searchKeyWord"
                                        data-qc="searchKeyWord"
                                        onChange={(e) => this.handleSearch(e.currentTarget.value)}
                                        style={{ direction: 'rtl', borderRight: 0, padding: 22 }}
                                        placeholder={local.search}
                                    />
                                    <InputGroup.Append>
                                        <InputGroup.Text style={{ background: '#fff' }}><span className="fa fa-search fa-rotate-90"></span></InputGroup.Text>
                                    </InputGroup.Append>
                                    {this.props.dropDownKeys && this.props.dropDownKeys.length ?
                                        <DropdownButton
                                            as={InputGroup.Append}
                                            variant="outline-secondary"
                                            title={this.getArValue(this.state.dropDownValue)}
                                            id="input-group-dropdown-2"
                                            data-qc="search-dropdown"
                                        >
                                            {this.props.dropDownKeys.map((key, index) =>
                                                <Dropdown.Item key={index} data-qc={key} onClick={() => this.setState({ dropDownValue: key }, () => this.handleSearch(this.state.searchKeyword))}>{this.getArValue(key)}</Dropdown.Item>
                                            )}
                                        </DropdownButton>
                                        : null}
                                </InputGroup>
                                {(this.state.options.length > 0 || this.state.selectedOptions.length > 0) && <>
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
                                        {(!this.props.search && !this.props.dropDownKeys) ? this.state.options
                                            .filter(option => option[this.props.labelKey].toLocaleLowerCase().includes(this.state.searchKeyword.toLocaleLowerCase()))
                                            .map(option => {
                                                return <div key={option._id}
                                                    className={(this.state.selectionArray.find((item) => item._id === option._id)) ? "list-group-item selected d-flex" : "list-group-item d-flex"}>
                                                    <Form.Check
                                                        type='checkbox'
                                                        // readOnly
                                                        id={option._id}
                                                        onChange={() => this.selectItem(option)}
                                                        label={option[this.props.labelKey]}
                                                        checked={this.state.selectionArray.find((item) => item._id === option._id)}
                                                        disabled={(this.props.disabled && this.props.disabled(option))}
                                                    />
                                                    {this.props.disabled && this.props.disabledMessage && this.props.disabled(option) && <span>{this.props.disabledMessage}</span>}
                                                </div>
                                            }
                                            ) : this.state.options
                                                .map(option => {
                                                    return <div key={option._id}
                                                        className={(this.state.selectionArray.find((item) => item._id === option._id)) ? "list-group-item selected d-flex" : "list-group-item d-flex"}>
                                                        <Form.Check
                                                            type='checkbox'
                                                            // readOnly
                                                            id={option._id}
                                                            onChange={() => this.selectItem(option)}
                                                            label={option[this.props.labelKey]}
                                                            checked={this.state.selectionArray.find((item) => item._id === option._id)}
                                                            disabled={(this.props.disabled && this.props.disabled(option))}
                                                        />
                                                        {this.props.disabled && this.props.disabledMessage && this.props.disabled(option) && <span>{this.props.disabledMessage}</span>}
                                                    </div>
                                                }
                                                )}
                                    </div>
                                </>}
                            </ul>
                        </div>
                    </div>
                    {(this.state.options.length > 0 || this.state.selectedOptions.length > 0) && <div className="list-button">
                        <Button className="btn btn-default btn-md" style={{ height: 45, width: 95, margin: '20px 0px' }} disabled={this.state.selectionArray.length < 1} onClick={() => this.addToSelectedList()}>
                            {local.add}<span className={!this.props.vertical ? "fa fa-arrow-left" : "fa fa-arrow-down"}></span>
                        </Button>
                    </div>}
                    {(this.state.options.length > 0 || this.state.selectedOptions.length > 0) && <div className={!this.props.vertical ? 'dual-list list-right col-md-5' : 'dual-list list-right'}>
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
                                        <span ><img src={require('../../Assets/deleteIcon.svg')} /></span>
                                        <span>{local.deleteAll}</span>
                                    </div>
                                </div>
                                <div className="scrollable-list">
                                    {this.state.selectedOptions
                                        .filter(option => option[this.props.labelKey].toLocaleLowerCase().includes(this.state.searchSelectedKeyWord.toLocaleLowerCase()))
                                        .map(option => <li key={option._id}
                                            className="list-group-item"><span onClick={() => this.removeItemFromList(option)}><img style={{ width: '15px', height: '15px' }} src={require('../../Assets/closeIcon.svg')} /></span><span>{option[this.props.labelKey]}</span>{this.props.viewSelected && <span onClick={() => this.viewSelected(option._id)} className='fa fa-eye icon' style={{ float: 'left' }}></span>}</li>)}
                                </div>
                            </ul>
                        </div>
                    </div>}
                </div>
            </div>
        )
    }
}
export default DualBox