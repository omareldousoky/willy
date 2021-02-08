import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';

interface Option {
    name: string;
    disabledUi: boolean;
    id: string;
    activated: boolean;
}
interface Props {
    source: string;
    options: Array<Option>;
    addOption: Function;
    newOption: Function;
    updateOption: Function;
}
interface State {
    options: Array<Option>;
    loading: boolean;
    filterOptions: string;
    temp: Array<string>;
    source: string;
}
class CRUDList extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            loading: false,
            filterOptions: '',
            source: '',
            temp: []
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.source !== state.source || JSON.stringify(props.options) !== JSON.stringify(state.options)) {
            console.log('UPDATEEEE1')
            return {
                source: props.source,
                options: props.options,
                temp: props.options.map(option => option.name)
            }
        }
        else {
            return null
        }
    }
    // componentDidUpdate(prevProps) {
    //     if (this.props.source !== prevProps.source) {
    //         console.log('UPDATEEEE2')
    //         this.setState({ source: this.props.source })
    //     }
    // }
    componentDidMount() {
    //     this.setState({ loading: true });
    //     const res = await getLoanUsage();
    //     if (res.status === "success") {
    //         const responseLoanUsages = res.body.usages.map(usage => ({ ...usage, disabledUi: true }));
            this.setState({
                // loading: false,
                options: this.props.options,
                temp: this.props.options.map(usage => usage.name)
            });
    //     } else {
    //         this.setState({ loading: false }, () => Swal.fire("Error !", getErrorMessage(res.error.error), 'error'));
    //     }
    }
    addOption() {
        if (!this.state.options.some(option => option.name === "")) {
            this.props.addOption()
        //     this.setState({
        //         filterOptions: '',
        //         options: [...this.state.options, { name: "", disabledUi: false, id: "", activated: true }],
        //         temp: [...this.state.temp, '']
        //     })
        }
    }
    handleChangeInput(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        this.setState({
            options: this.state.options.map((option, optionIndex) => optionIndex === index ? { ...option, name: event.currentTarget.value } : option)
        })
    }
    handleKeyDown(event: React.KeyboardEvent, index: number) {
        if (event.key === 'Enter') {
            this.toggleClick(index, true)
        }
    }
    async toggleClick(index: number, submit: boolean) {
        console.log('Click', submit, this.state.options[index])
        if (this.state.options[index].disabledUi === false && this.state.options[index].name.trim() !== "" && submit) {
            if (this.state.options[index].id === "") {
                //New 
                this.props.newOption(this.state.options[index].name, this.state.options[index].activated, index);
            } else {
                //Edit 
                this.props.updateOption(this.state.options[index].id, this.state.options[index].name, this.state.options[index].activated, index);
            }
        } else if (!submit) {
            const options = this.state.options;
            options[index].disabledUi = !options[index].disabledUi;
            this.setState({ options })
        }
    }
    render() {
        return (

            <Container style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <Form.Control
                        type="text"
                        data-qc="filterOptions"
                        placeholder={local.search}
                        maxLength={100}
                        value={this.state.filterOptions}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ filterOptions: e.currentTarget.value })}
                    />
                    {/* <h4 style={{ textAlign: 'right' }}>{local.options}</h4> */}
                    <span
                        onClick={() => this.addOption()}
                        className="fa fa-plus fa-lg"
                        style={{ margin: '0px 20px', color: '#7dc356', cursor: 'pointer' }}
                    />
                </div>
                <ListGroup style={{ textAlign: 'right', width: '30%', marginBottom: 30 }}>
                    <Loader type="fullsection" open={this.state.loading} />
                    {console.log(this.state.options)}
                    {this.state.options
                        .filter(option => option.name.toLocaleLowerCase().includes(this.state.filterOptions.toLocaleLowerCase()))
                        .map((option, index) => {
                            return (
                                <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Group style={{ margin: '0px 0px 0px 20px' }}>
                                        <Form.Control
                                            type="text"
                                            data-qc="loanUsageInput"
                                            maxLength={100}
                                            title={option.name}
                                            value={option.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChangeInput(e, index)}
                                            onKeyDown={(e: React.KeyboardEvent) => this.handleKeyDown(e, index)}
                                            disabled={option.disabledUi}
                                            style={option.disabledUi ? { background: 'none', border: 'none' } : {}}
                                            isInvalid={this.state.options[index].name.trim() === ""}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {local.required}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {option.disabledUi ?
                                        <span
                                            style={option.activated ? { color: '#7dc356', marginLeft: 20 } : { color: '#d51b1b', marginLeft: 20 }}
                                            className={option.activated ? "fa fa-check-circle fa-lg" : "fa fa-times-circle fa-lg"} />
                                        :
                                        <>
                                            <Form.Check
                                                type="checkbox"
                                                data-qc={`activate${index}`}
                                                label={local.active}
                                                className="checkbox-label"
                                                checked={this.state.options[index].activated}
                                                onChange={() => this.setState({ options: this.state.options.map((option, optionIndex) => optionIndex === index ? { ...option, activated: !this.state.options[index].activated } : option) })}
                                            />
                                            <span className="fa fa-undo fa-lg"
                                                style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                                                onClick={() => this.state.temp[index] !== '' ? this.setState({ options: this.state.options.map((option, optionIndex) => optionIndex === index ? { ...option, name: this.state.temp[index], disabledUi: true } : option) }) : this.setState({ options: this.state.options.filter(loanItem => loanItem.id !== "") })}
                                            />
                                        </>
                                    }
                                    <span
                                        onClick={() => option.disabledUi ? this.toggleClick(index, false) : this.toggleClick(index, true)}
                                        style={{ color: '#7dc356', cursor: 'pointer', marginLeft: 20 }}
                                        data-qc="editSaveIcon"
                                        className={option.disabledUi ? "fa fa-edit fa-lg" : "fa fa-save fa-lg"} />
                                </ListGroup.Item>
                            )
                        }).reverse()}
                </ListGroup>
            </Container>
        );
    }
}

export default CRUDList;